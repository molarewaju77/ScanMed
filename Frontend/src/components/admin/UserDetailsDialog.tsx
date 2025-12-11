import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Mail, Calendar, Shield, CheckCircle, Ban, Clock } from "lucide-react";

interface UserDetailsDialogProps {
    user: any;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function UserDetailsDialog({ user, open, onOpenChange }: UserDetailsDialogProps) {
    if (!user) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>User Details</DialogTitle>
                </DialogHeader>

                <div className="flex flex-col items-center py-4 space-y-4">
                    {/* Avatar */}
                    <div className="w-20 h-20 rounded-full gradient-medical flex items-center justify-center text-primary-foreground text-2xl font-bold mb-2">
                        {user.name.split(" ").map((n: string) => n[0]).join("")}
                    </div>

                    <div className="text-center space-y-1">
                        <h3 className="text-xl font-semibold text-foreground">{user.name}</h3>
                        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${user.role === 'superadmin' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' :
                                    user.role === 'admin' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
                                        user.role === 'manager' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' :
                                            user.role === 'worker' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                                                'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                                }`}>
                                {user.role}
                            </span>
                            <span className="flex items-center gap-1">
                                {user.isVerified ? (
                                    <><CheckCircle className="w-3 h-3 text-success" /> Verified</>
                                ) : (
                                    <><Ban className="w-3 h-3 text-yellow-500" /> Pending</>
                                )}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-border">
                    <div className="grid grid-cols-[24px_1fr] gap-2 items-center">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <div className="text-sm">
                            <p className="text-muted-foreground text-xs">Email Address</p>
                            <p className="font-medium text-foreground">{user.email}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-[24px_1fr] gap-2 items-center">
                        <Shield className="w-4 h-4 text-muted-foreground" />
                        <div className="text-sm">
                            <p className="text-muted-foreground text-xs">Account Role</p>
                            <p className="font-medium text-foreground capitalize">{user.role}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-[24px_1fr] gap-2 items-center">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <div className="text-sm">
                            <p className="text-muted-foreground text-xs">Joined Date</p>
                            <p className="font-medium text-foreground">
                                {new Date(user.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </p>
                        </div>
                    </div>

                    {user.lastLogin && (
                        <div className="grid grid-cols-[24px_1fr] gap-2 items-center">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            <div className="text-sm">
                                <p className="text-muted-foreground text-xs">Last Active</p>
                                <p className="font-medium text-foreground">
                                    {new Date(user.lastLogin).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
