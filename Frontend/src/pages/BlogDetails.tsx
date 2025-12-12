import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import api from "@/lib/api";
import { Loader2, ArrowLeft, Calendar, Clock, Tag, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface BlogPost {
    _id: string;
    title: string;
    content: string;
    excerpt: string;
    category: string;
    image: string;
    readTime: string;
    author: string;
    publishedAt: string;
    views: number;
}

const BlogDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [article, setArticle] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchArticle();
    }, [id]);

    const fetchArticle = async () => {
        try {
            // Logic to support both ID and Slug if needed, but we use ID for now
            const response = await api.get(`/articles/id/${id}`);
            if (response.data.success) {
                setArticle(response.data.article);
                // Increment view count
                api.post(`/articles/${id}/view`);

                // Log to reading history
                api.post("/reading-history", {
                    title: response.data.article.title,
                    category: response.data.article.category,
                    readTime: response.data.article.readTime,
                    articleId: response.data.article._id
                }).catch(err => console.error("Failed to log reading history", err));
            }
        } catch (error) {
            console.error("Failed to fetch article:", error);
            toast.error("Failed to load article");
        } finally {
            setLoading(false);
        }
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard");
    };

    if (loading) {
        return (
            <MainLayout>
                <div className="flex justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            </MainLayout>
        );
    }

    if (!article) {
        return (
            <MainLayout>
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                    <h1 className="text-2xl font-bold">Article not found</h1>
                    <Button onClick={() => navigate("/health-blog")}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Blog
                    </Button>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <article className="max-w-4xl mx-auto space-y-8 pb-12">
                {/* Header */}
                <div className="space-y-4">
                    <Button
                        variant="ghost"
                        className="pl-0 hover:pl-0 hover:bg-transparent text-muted-foreground hover:text-foreground"
                        onClick={() => navigate("/health-blog")}
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Articles
                    </Button>

                    <div className="space-y-2">
                        <Badge variant="secondary" className="mb-2">
                            {article.category}
                        </Badge>
                        <h1 className="text-3xl md:text-5xl font-bold text-foreground leading-tight">
                            {article.title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground pt-2">
                            <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {new Date(article.publishedAt).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {article.readTime}
                            </span>
                            <span className="flex items-center gap-1">
                                <Tag className="w-4 h-4" />
                                {article.author || "ScanMed Team"}
                            </span>
                            <Button variant="ghost" size="sm" onClick={handleShare}>
                                <Share2 className="w-4 h-4 mr-2" />
                                Share
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Featured Image */}
                <div className="rounded-2xl overflow-hidden aspect-video bg-muted relative border border-border">
                    <img
                        src={
                            article.image ||
                            "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=1200&h=600&fit=crop"
                        }
                        alt={article.title}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Content */}
                <div className="prose prose-lg dark:prose-invert max-w-none">
                    {/* Simple whitespace handling for now. 
              Ideally use a markdown renderer if content is markdown. 
              Assuming plain text with newlines for basic blog system. */}
                    {article.content.split('\n').map((paragraph, index) => (
                        paragraph.trim() && <p key={index}>{paragraph}</p>
                    ))}
                </div>

            </article>
        </MainLayout>
    );
};

export default BlogDetails;
