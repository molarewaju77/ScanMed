import { User } from '../models/user.model.js';

// Get all users (admin+)
export const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', role } = req.query;

    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    if (role && role !== 'all') {
      query.role = role;
    }

    const users = await User.find(query)
      .select("-password")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      users,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single user by ID (admin+)
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update user role with permission checks
export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role: newRole } = req.body;
    const currentUser = req.user; // From auth middleware

    // Validate new role
    const validRoles = ['user', 'worker', 'manager', 'admin', 'superadmin'];
    if (!validRoles.includes(newRole)) {
      return res.status(400).json({ success: false, message: "Invalid role" });
    }

    // Get target user
    const targetUser = await User.findById(id);
    if (!targetUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Prevent self-role change
    if (currentUser._id.toString() === id) {
      return res.status(403).json({
        success: false,
        message: "Cannot change your own role"
      });
    }

    // Permission logic
    let allowed = false;
    let reason = "";

    if (currentUser.role === 'superadmin') {
      // Super admin can do anything
      allowed = true;
    } else if (currentUser.role === 'admin') {
      // Admin cannot assign admin or superadmin roles
      if (['admin', 'superadmin'].includes(newRole)) {
        reason = "Admins cannot assign admin or superadmin roles";
      }
      // Admin cannot modify admin or superadmin users
      else if (['admin', 'superadmin'].includes(targetUser.role)) {
        reason = "Admins cannot modify admin or superadmin users";
      } else {
        allowed = true;
      }
    } else if (currentUser.role === 'manager') {
      // Manager can only assign user or worker roles
      if (!['user', 'worker'].includes(newRole)) {
        reason = "Managers can only assign user or worker roles";
      }
      // Manager cannot modify manager+ users
      else if (['manager', 'admin', 'superadmin'].includes(targetUser.role)) {
        reason = "Managers cannot modify manager or higher level users";
      } else {
        allowed = true;
      }
    } else {
      reason = "Insufficient permissions";
    }

    if (!allowed) {
      return res.status(403).json({ success: false, message: reason });
    }

    // Update role
    targetUser.role = newRole;
    await targetUser.save();

    res.status(200).json({
      success: true,
      message: `User role updated to ${newRole}`,
      user: {
        ...targetUser._doc,
        password: undefined
      }
    });
  } catch (error) {
    console.error('Failed to update user role:', error);
    res.status(500).json({ success: false, message: 'Server error updating role' });
  }
};

// Delete user (admin+, with protections)
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUser = req.user;

    const targetUser = await User.findById(id);
    if (!targetUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Prevent self-deletion
    if (currentUser._id.toString() === id) {
      return res.status(403).json({
        success: false,
        message: "Cannot delete your own account"
      });
    }

    // Super admin protection
    if (targetUser.role === 'superadmin') {
      return res.status(403).json({
        success: false,
        message: "Cannot delete super admin accounts"
      });
    }

    // Admin can only delete user/worker/manager
    if (currentUser.role === 'admin' && targetUser.role === 'admin') {
      return res.status(403).json({
        success: false,
        message: "Admins cannot delete other admins"
      });
    }

    await User.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error('Failed to delete user:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Search users (admin+)
export const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ success: false, message: "Query is required" });
    }

    const regex = new RegExp(query, 'i');
    const users = await User.find({
      $or: [
        { name: regex },
        { email: regex },
        { role: regex }
      ],
    }).select('-password').limit(20);

    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get user statistics (admin+)
// Get user statistics (admin+)
export const getUserStats = async (req, res) => {
  try {
    const currentUserRole = req.user.role;
    let allowedRoles = [];

    // Define visibility based on role
    switch (currentUserRole) {
      case 'superadmin':
        allowedRoles = ['user', 'worker', 'manager', 'admin', 'superadmin'];
        break;
      case 'admin':
        allowedRoles = ['user', 'worker', 'manager'];
        break;
      case 'manager':
        allowedRoles = ['user', 'worker'];
        break;
      case 'worker':
        allowedRoles = ['user'];
        break;
      default:
        allowedRoles = ['user'];
    }

    // Filter queries
    const roleQuery = { role: { $in: allowedRoles } };

    const totalUsers = await User.countDocuments(roleQuery);

    const usersByRole = await User.aggregate([
      { $match: roleQuery },
      { $group: { _id: "$role", count: { $sum: 1 } } }
    ]);

    const recentUsers = await User.find(roleQuery)
      .select("name email role createdAt")
      .sort({ createdAt: -1 })
      .limit(5);

    // Get active users (logged in within last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const activeUsers = await User.countDocuments({
      ...roleQuery,
      lastLogin: { $gte: sevenDaysAgo }
    });

    const stats = {
      totalUsers,
      activeUsers,
      roleDistribution: usersByRole.reduce((acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      }, {}),
      recentUsers,
      allowedRoles // Send this to frontend to know what to show
    };

    res.status(200).json({ success: true, stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
