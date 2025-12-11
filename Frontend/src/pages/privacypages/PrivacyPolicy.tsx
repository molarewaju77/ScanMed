import { MainLayout } from "@/components/layout/MainLayout";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Shield, Lock, Eye, Server, FileText, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, Link } from "react-router-dom";

const PrivacyPolicy = () => {
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
                            <Shield className="w-8 h-8 text-primary" />
                        </div>
                        <h1 className="text-3xl font-bold text-foreground">Privacy & Transparency</h1>
                    </div>
                    <p className="text-lg text-muted-foreground">
                        We believe in complete transparency about how we handle your health data.
                        Learn about our policies, data usage, and your rights below.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 max-w-4xl py-12 space-y-16">

                {/* Section 1: Detailed Privacy Policy */}
                <section id="policy" className="scroll-mt-20">
                    <div className="flex items-center gap-3 mb-6">
                        <FileText className="w-6 h-6 text-primary" />
                        <h2 className="text-2xl font-bold">Privacy Policy</h2>
                    </div>
                    <div className="prose dark:prose-invert max-w-none space-y-4 text-muted-foreground">
                        <p>
                            <strong>Last Updated: December 5, 2025</strong>
                        </p>
                        <p>
                            At ScanMed, your privacy is our top priority. This Privacy Policy outlines the types of information we collect,
                            how we use it, and the steps we take to safeguard your personal and health data.
                        </p>

                        <h3 className="text-xl font-semibold text-foreground mt-6 mb-2">1. Information We Collect</h3>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong>Personal Information:</strong> Name, email address, and minimal profile details to manage your account.</li>
                            <li><strong>Health Data:</strong> Scans, symptoms, and health logs you voluntarily upload for analysis.</li>
                            <li><strong>Usage Data:</strong> Anonymized data on how you interact with the app to help us improve performance.</li>
                        </ul>

                        <h3 className="text-xl font-semibold text-foreground mt-6 mb-2">2. How We Use Your Data</h3>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>To provide AI-powered health analysis and recommendations.</li>
                            <li>To maintain and improve the security of our platform.</li>
                            <li>To communicate with you regarding your account and updates.</li>
                        </ul>

                        <h3 className="text-xl font-semibold text-foreground mt-6 mb-2">3. Data Security</h3>
                        <p>
                            We employ state-of-the-art encryption (AES-256) for data at rest and TLS 1.3 for data in transit.
                            Your sensitive health information is stored in secure, HIPAA-compliant cloud infrastructure.
                        </p>
                    </div>
                </section>

                {/* Section 2: Data Usage & Improvement */}
                <section id="data-usage" className="scroll-mt-20">
                    <div className="flex items-center gap-3 mb-6">
                        <Server className="w-6 h-6 text-primary" />
                        <h2 className="text-2xl font-bold">Data Usage & AI Training</h2>
                    </div>
                    <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                        <p className="text-muted-foreground">
                            Our AI models learn from data to become more accurate. However, we strictly adhere to the following principles:
                        </p>

                        <div className="grid md:grid-cols-2 gap-6 mt-4">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 font-semibold text-foreground">
                                    <Eye className="w-5 h-5 text-blue-500" />
                                    Anonymization First
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Before any data is used for model improvement, all personally identifiable information (PII) is stripped away. The AI never sees your name or email.
                                </p>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2 font-semibold text-foreground">
                                    <Lock className="w-5 h-5 text-green-500" />
                                    Strict Access Control
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Only authorized data scientists have access to anonymized datasets for training purposes. Access is logged and audited.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section 3: FAQ */}
                <section id="faq" className="scroll-mt-20">
                    <div className="flex items-center gap-3 mb-6">
                        <HelpCircle className="w-6 h-6 text-primary" />
                        <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
                    </div>

                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="item-1">
                            <AccordionTrigger>Is my data shared with third parties?</AccordionTrigger>
                            <AccordionContent>
                                No. We do not sell or share your personal health data with advertisers or third-party marketing firms.
                                Data is only shared if legally required or with your explicit consent (e.g., exporting a report to your doctor).
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                            <AccordionTrigger>Can I delete my data?</AccordionTrigger>
                            <AccordionContent>
                                Yes. You have the "Right to be Forgotten." You can request full account deletion from the Settings page,
                                and your data will be permanently removed from our servers within 30 days.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-3">
                            <AccordionTrigger>Is this app a replacement for a doctor?</AccordionTrigger>
                            <AccordionContent>
                                <strong>No.</strong> ScanMed is an AI-assisted tool for informational purposes only. It does not provide medical diagnoses.
                                Always consult a certified medical professional for health concerns.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-4">
                            <AccordionTrigger>How secure are my scans?</AccordionTrigger>
                            <AccordionContent>
                                Your scans are encrypted both when being sent to our servers and when stored. We utilize enterprise-grade security protocols
                                to ensure only you can access your personal records.
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
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
        </div >
    );
};

export default PrivacyPolicy;
