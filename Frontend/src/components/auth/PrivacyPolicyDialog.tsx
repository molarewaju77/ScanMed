import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

interface PrivacyPolicyDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function PrivacyPolicyDialog({ open, onOpenChange }: PrivacyPolicyDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] h-[80vh] flex flex-col p-0 gap-0">
                <DialogHeader className="p-6 pb-2">
                    <DialogTitle>Privacy Policy & Terms of Service</DialogTitle>
                    <DialogDescription>
                        Please read our terms and conditions carefully before proceeding.
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="flex-1 p-6 pt-2">
                    <div className="space-y-6 text-sm text-foreground/80">
                        <section className="space-y-2">
                            <h3 className="font-semibold text-foreground text-base">1. Introduction</h3>
                            <p>
                                Welcome to ScanMed. By creating an account and using our services, you agree to comply with and be bound by the following terms and conditions. If you do not agree to these terms, you should not use this application.
                            </p>
                        </section>

                        <section className="space-y-2">
                            <h3 className="font-semibold text-foreground text-base">2. Data Collection & Privacy</h3>
                            <p>
                                We take your privacy seriously. We collect personal information and health data solely for the purpose of providing our services. By using ScanMed, you consent to the collection and processing of your data as described in our Privacy Policy.
                            </p>
                            <ul className="list-disc pl-5 space-y-1 mt-2">
                                <li>We collect personal details (name, email) for account management.</li>
                                <li>Health data is processed to provide AI-driven analysis.</li>
                                <li>We employ industry-standard security measures to protect your data.</li>
                            </ul>
                        </section>

                        <section className="space-y-2">
                            <h3 className="font-semibold text-foreground text-base">3. User Responsibilities</h3>
                            <p>
                                You are responsible for maintaining the confidentiality of your account credentials. You agree to provide accurate and complete information during registration and to update it as necessary.
                            </p>
                        </section>

                        <section className="space-y-2">
                            <h3 className="font-semibold text-foreground text-base">4. Medical Disclaimer</h3>
                            <p>
                                ScanMed is an AI-assisted tool and <strong>does not replace professional medical advice, diagnosis, or treatment</strong>. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
                            </p>
                        </section>

                        <section className="space-y-2">
                            <h3 className="font-semibold text-foreground text-base">5. Account Termination</h3>
                            <p>
                                We reserve the right to suspend or terminate your account if you violate these terms or engage in fraudulent or abusive activities.
                            </p>
                        </section>

                        <section className="space-y-2">
                            <h3 className="font-semibold text-foreground text-base">6. Updates to Terms</h3>
                            <p>
                                We may update these terms from time to time. Continued use of the service after changes constitutes acceptance of the new terms.
                            </p>
                        </section>
                    </div>
                </ScrollArea>

                <div className="p-6 pt-2 border-t border-border mt-auto flex flex-col gap-3">
                    <Button onClick={() => onOpenChange(false)} className="w-full">
                        I Understand
                    </Button>
                    <div className="text-center">
                        <a
                            href="/legal/privacy"
                            className="text-sm text-primary hover:underline transition-colors"
                            onClick={(e) => {
                                window.location.href = "/legal/privacy";
                            }}
                        >
                            Read Full Policy & FAQs
                        </a>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
