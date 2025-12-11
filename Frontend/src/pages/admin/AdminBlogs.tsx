import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { toast } from "sonner";
import api from "@/lib/api";
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const AdminBlogs = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchArticles();
    }, []);

    const fetchArticles = async () => {
        try {
            const response = await api.get("/articles?limit=100"); // Fetch all for admin
            if (response.data.success) {
                setArticles(response.data.articles);
            }
        } catch (error: any) {
            console.error("Failed to fetch articles:", error);
            toast.error("Failed to load articles");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this article?")) {
            return;
        }

        try {
            await api.delete(`/articles/${id}`);
            toast.success("Article deleted successfully");
            setArticles(articles.filter((article: any) => article._id !== id));
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to delete article");
        }
    };

    return (
        <MainLayout>
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Blog Management</h1>
                        <p className="text-muted-foreground mt-1">
                            Create and manage blog posts
                        </p>
                    </div>
                    <Link to="/admin/blogs/new">
                        <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            Create New Post
                        </Button>
                    </Link>
                </div>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <div className="bg-card rounded-lg border shadow-sm">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Author</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Views</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {articles.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                            No articles found. Create your first one!
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    articles.map((article: any) => (
                                        <TableRow key={article._id}>
                                            <TableCell className="font-medium">{article.title}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="capitalize">
                                                    {article.category}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{article.author}</TableCell>
                                            <TableCell>
                                                <Badge variant={article.published ? "default" : "secondary"}>
                                                    {article.published ? "Published" : "Draft"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{article.views}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Link to={`/admin/blogs/edit/${article._id}`}>
                                                        <Button variant="ghost" size="icon">
                                                            <Pencil className="w-4 h-4" />
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-destructive hover:text-destructive"
                                                        onClick={() => handleDelete(article._id)}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </div>
        </MainLayout>
    );
};

export default AdminBlogs;
