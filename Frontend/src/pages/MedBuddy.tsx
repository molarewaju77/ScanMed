import { MainLayout } from "@/components/layout/MainLayout";
import { MedicationSection } from "@/components/medbuddy/MedicationSection";
import { AppointmentsCard } from "@/components/medbuddy/AppointmentsCard";
import { WeeklyAdherenceChart } from "@/components/medbuddy/WeeklyAdherenceChart";

const MedBuddy = () => {
  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Med Buddy</h1>
          <p className="text-muted-foreground mt-1">
            Manage your medications and appointments
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <MedicationSection />
          <WeeklyAdherenceChart />
        </div>

        <AppointmentsCard />
      </div>
    </MainLayout>
  );
};

export default MedBuddy;
