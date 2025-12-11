import { Shield, Bug } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const ReportBug = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background">
            <div className="bg-primary/5 py-12">
                <div className="container mx-auto px-4 max-w-4xl">
                    <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4 pl-0 hover:bg-transparent hover:text-primary">
                        ← Back
                    </Button>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-primary/10 rounded-2xl">
                            <Bug className="w-8 h-8 text-primary" />
                        </div>
                        <h1 className="text-3xl font-bold text-foreground">Report a Bug</h1>
                    </div>
                    <p className="text-lg text-muted-foreground">
                        Help us improve by reporting any issues you find.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 max-w-4xl py-12 space-y-16">
                <section className="scroll-mt-20">
                    <div className="max-w-xl space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Issue Subject</label>
                            <Input placeholder="Brief description of the issue" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Description</label>
                            <Textarea
                                placeholder="Please describe the bug in detail, including steps to reproduce it."
                                className="min-h-[150px]"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Email (Optional)</label>
                            <Input type="email" placeholder="Your email for follow-up" />
                        </div>

                        <Button className="w-full">Submit Report</Button>
                    </div>
                </section>
            </div>

            {/* Footer with Links */}
            <footer className="border-t border-border mt-16 bg-muted/30">
                <div className="container mx-auto px-4 py-12">
                    <div className="grid md:grid-cols-4 gap-8">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <Shield className="w-5 h-5 text-primary" />
                                <span className="font-bold text-lg">ScanMed</span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Committed to transparency, security, and your privacy. Proudly based in Nigeria.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-3">Legal</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li><Link to="/legal/terms" className="hover:text-primary">Terms of Service</Link></li>
                                <li><Link to="/legal/privacy" className="hover:text-primary">Privacy Policy</Link></li>
                                <li><Link to="/legal/cookies" className="hover:text-primary">Cookie Policy</Link></li>
                                <li><Link to="/legal/medical-disclaimer" className="hover:text-primary">Medical Disclaimer</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-3">Documentation</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li><Link to="/docs/user-guide" className="hover:text-primary">User Guide</Link></li>
                                <li><Link to="/docs/data-bylaws" className="hover:text-primary">Data Bylaws</Link></li>
                                <li><Link to="/docs/compliance" className="hover:text-primary">Compliance</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-3">Support</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li><Link to="/support/help" className="hover:text-primary">Help Center</Link></li>
                                <li><Link to="/support/contact" className="hover:text-primary">Contact Us</Link></li>
                                <li><Link to="/support/bug-report" className="hover:text-primary">Report a Bug</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-border mt-12 pt-8 text-center text-sm text-muted-foreground">
                        <p>© {new Date().getFullYear()} ScanMed. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default ReportBug;
