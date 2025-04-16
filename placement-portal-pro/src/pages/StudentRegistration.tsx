import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BasicInfoForm } from "@/components/registration/BasicInfoForm";
import { DetailedInfoForm } from "@/components/registration/DetailedInfoForm";
import { StudentRegistrationProvider } from "@/contexts/StudentRegistrationContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const StudentRegistration = () => {
  const [step, setStep] = useState<1 | 2>(1);
  const navigate = useNavigate();

  const handleBackToBasicInfo = () => {
    setStep(1);
  };

  const handleCancel = () => {
    if (confirm("Are you sure you want to cancel your registration?")) {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-[#020817] py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
      <div className="w-full max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground">Student Registration</h1>
          <p className="mt-2 text-muted-foreground">
            Complete your registration to join the placement portal
          </p>
        </div>

        <div className="w-full">
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-between text-sm font-medium leading-6">
              <span 
                className={`px-4 py-2 rounded-full cursor-pointer ${step >= 1 ? "bg-primary text-white" : "bg-gray-200 text-gray-600"}`}
                onClick={() => step > 1 && setStep(1)}
              >
                1. Basic Information
              </span>
              <span className={`px-4 py-2 rounded-full ${step >= 2 ? "bg-primary text-white" : "bg-gray-200 text-gray-600"}`}>
                2. Detailed Profile
              </span>
            </div>
          </div>

          <Card className="bg-[#1E293B]/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>
                {step === 1 ? "Basic Information" : "Detailed Profile"}
              </CardTitle>
              <CardDescription>
                {step === 1
                  ? "Please provide your basic details to get started"
                  : "Complete your profile with comprehensive information"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <StudentRegistrationProvider>
                {step === 1 ? (
                  <BasicInfoForm onNext={() => setStep(2)} />
                ) : (
                  <>
                    <DetailedInfoForm />
                    <div className="mt-4 flex justify-start">
                      <Button 
                        variant="outline" 
                        onClick={handleBackToBasicInfo}
                        className="mr-2"
                      >
                        Back to Basic Info
                      </Button>
                      <Button 
                        variant="ghost" 
                        onClick={handleCancel}
                      >
                        Cancel Registration
                      </Button>
                    </div>
                  </>
                )}
              </StudentRegistrationProvider>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudentRegistration;