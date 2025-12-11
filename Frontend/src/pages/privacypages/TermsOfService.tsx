import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Shield, Lock, Eye, Server, FileText, HelpCircle, FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, Link } from "react-router-dom";

const TermsOfService = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="bg-primary/5 py-12">
                <div className="container mx-auto px-4 max-w-4xl">
                    <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4 pl-0 hover:bg-transparent hover:text-primary">
                        ← Back
                    </Button>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-primary/10 rounded-2xl">
                            <FileCheck className="w-8 h-8 text-primary" />
                        </div>
                        <h1 className="text-3xl font-bold text-foreground">Terms of Service</h1>
                    </div>
                    <p className="text-lg text-muted-foreground">
                        Please read these terms carefully before using our services.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 max-w-4xl py-12 space-y-16">
                <section id="terms" className="scroll-mt-20">
                    <div className="prose dark:prose-invert max-w-none space-y-4 text-muted-foreground">
                        <p><strong>Last Updated: December 5, 2025</strong></p>
                        <p>
                            Welcome to ScanMed. By accessing or using our website and services, you agree to be bound by these Terms of Service.
                        </p>
                        <h3 className="text-xl font-semibold text-foreground mt-6 mb-2">1. Acceptance of Terms</h3>
                        <p>
                            By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the Service.
                        </p>
                        <h3 className="text-xl font-semibold text-foreground mt-6 mb-2">2. Accounts</h3>
                        <p>
                            When you create an account with us, you must provide us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
                        </p>
                        <h3 className="text-xl font-semibold text-foreground mt-6 mb-2">3. Intellectual Property</h3>
                        <p>
                            The Service and its original content, features, and functionality are and will remain the exclusive property of ScanMed and its licensors.
                        </p>
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

export default TermsOfService;
