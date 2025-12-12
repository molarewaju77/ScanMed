import { MainLayout } from "@/components/layout/MainLayout";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import api from "@/lib/api";
import { Loader2 } from "lucide-react";

interface BlogPost {
  _id: string;
  title: string;
  excerpt: string;
  category: string;
  image: string;
  readTime: string;
}

const categories = [
  { id: "all", label: "All" },
  { id: "Eye Health", label: "Eye" },
  { id: "Dental Health", label: "Teeth" },
  { id: "Skin Health", label: "Skin" }, // Assuming category names match backend enum or are mapped
  { id: "Wellness", label: "Wellness" },
  { id: "General Health", label: "General" },
];

const getCategoryColor = (category: string) => {
  switch (category) {
    case "Eye Health":
      return "bg-primary/10 text-primary";
    case "Dental Health":
      return "bg-success/10 text-success";
    case "Skin Health":
      return "bg-warning/10 text-warning";
    default:
      return "bg-accent text-accent-foreground";
  }
};

const HealthBlog = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("all");
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await api.get("/articles?limit=100");
      if (response.data.success) {
        setBlogPosts(response.data.articles);
      }
    } catch (error) {
      console.error("Failed to fetch articles:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts =
    activeCategory === "all"
      ? blogPosts
      : blogPosts.filter((post) => post.category === activeCategory);

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Health Blog</h1>
          <p className="text-muted-foreground mt-1">
            Expert articles and tips for your wellbeing
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                activeCategory === cat.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-accent text-muted-foreground hover:text-foreground"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Blog Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.length === 0 ? (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                No articles found.
              </div>
            ) : (
              filteredPosts.map((post) => (
                <article
                  key={post._id}
                  className="medical-card-hover overflow-hidden group cursor-pointer"
                  onClick={() => navigate(`/health-blog/${post._id}`)}
                >
                  <div className="relative h-40 -mx-6 -mt-6 mb-4 overflow-hidden">
                    <img
                      src={
                        post.image ||
                        "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=400&h=250&fit=crop"
                      }
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span
                      className={cn(
                        "absolute top-3 left-3 text-xs px-2 py-1 rounded-full font-medium capitalize",
                        getCategoryColor(post.category)
                      )}
                    >
                      {post.category}
                    </span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {post.readTime}
                    </span>
                    <span className="text-sm font-medium text-primary group-hover:underline z-10">
                      Read More →
                    </span>
                  </div>
                </article>
              ))
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default HealthBlog;
