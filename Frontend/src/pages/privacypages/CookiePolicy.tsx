import { Shield, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, Link } from "react-router-dom";

const CookiePolicy = () => {
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
                            <Info className="w-8 h-8 text-primary" />
                        </div>
                        <h1 className="text-3xl font-bold text-foreground">Cookie Policy</h1>
                    </div>
                    <p className="text-lg text-muted-foreground">
                        How we use cookies and similar technologies.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 max-w-4xl py-12 space-y-16">
                <section className="scroll-mt-20">
                    <div className="prose dark:prose-invert max-w-none space-y-4 text-muted-foreground">
                        <p><strong>Last Updated: December 5, 2025</strong></p>
                        <p>
                            This Cookie Policy explains what cookies are and how ScanMed uses them.
                        </p>
                        <h3 className="text-xl font-semibold text-foreground mt-6 mb-2">What are Cookies?</h3>
                        <p>
                            Cookies are small text files that are sent to or accessed from your web browser or your device's memory. A cookie typically contains the name of the domain (internet location) from which the cookie originated, the "lifetime" of the cookie (i.e., when it expires) and a randomly generated unique number or similar identifier.
                        </p>
                        <h3 className="text-xl font-semibold text-foreground mt-6 mb-2">How We Use Cookies</h3>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong>Essential Cookies:</strong> Necessary for the proper functioning of the site (e.g., authentication).</li>
                            <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our website.</li>
                        </ul>
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

export default CookiePolicy;
