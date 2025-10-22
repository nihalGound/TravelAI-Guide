import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format, addDays, differenceInDays } from "date-fns";
import {
  CalendarIcon,
  MapPin,
  Heart,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker";

const formSchema = z.object({
  city: z.string().min(2, "City name must be at least 2 characters"),
  dateRange: z
    .object({
      from: z.date(),
      to: z.date(),
    })
    .refine(
      (data) =>
        data.from && data.to && differenceInDays(data.to, data.from) <= 7,
      "Trip duration cannot exceed 7 days"
    ),
  interests: z.array(z.string()).min(1, "Please select at least one interest"),
});

type FormData = z.infer<typeof formSchema>;

interface TravelPlanFormProps {
  onSubmit: (data: {
    city: string;
    dates: { start: string; end: string };
    interests: string[];
  }) => void;
}

const interestOptions = [
  { value: "art", label: "Art & Museums", icon: "🎨" },
  { value: "culture", label: "Culture & History", icon: "🏛️" },
  { value: "food", label: "Food & Dining", icon: "🍽️" },
  { value: "nature", label: "Nature & Outdoors", icon: "🌳" },
  { value: "adventure", label: "Adventure", icon: "🏔️" },
  { value: "shopping", label: "Shopping", icon: "🛍️" },
  { value: "nightlife", label: "Nightlife", icon: "🎉" },
  { value: "relaxation", label: "Relaxation", icon: "🧘" },
];

const TravelPlanForm = ({ onSubmit }: TravelPlanFormProps) => {
  const [step, setStep] = useState(1);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      city: "",
      dateRange: {
        from: undefined,
        to: undefined,
      },
      interests: [],
    },
  });

  const handleNext = async () => {
    let isValid = false;

    if (step === 1) {
      isValid = await form.trigger("city");
    } else if (step === 2) {
      isValid = await form.trigger("dateRange");
    }

    if (isValid) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleFormSubmit = (data: FormData) => {
    onSubmit({
      city: data.city,
      dates: {
        start: format(data.dateRange.from, "yyyy-MM-dd"),
        end: format(data.dateRange.to, "yyyy-MM-dd"),
      },
      interests: data.interests,
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto p-8 shadow-card">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleFormSubmit)}
          className="space-y-8"
        >
          <div className="flex items-center justify-center gap-2 mb-8">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  s === step ? "w-12 bg-primary" : "w-2 bg-muted"
                )}
              />
            ))}
          </div>

          {step === 1 && (
            <div className="space-y-6 animate-fade-in-up">
              <div className="text-center space-y-2">
                <MapPin className="w-12 h-12 mx-auto text-primary" />
                <h2 className="text-3xl font-bold">Where do you want to go?</h2>
                <p className="text-muted-foreground">
                  Enter your dream destination
                </p>
              </div>

              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="sr-only">City</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Paris, Tokyo, New York..."
                        className="text-lg h-14"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="button"
                onClick={handleNext}
                size="lg"
                className="w-full"
              >
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-fade-in-up">
              <div className="text-center space-y-2">
                <CalendarIcon className="w-12 h-12 mx-auto text-primary" />
                <h2 className="text-3xl font-bold">When are you traveling?</h2>
                <p className="text-muted-foreground">
                  Select your travel dates (max 7 days)
                </p>
              </div>

              <FormField
                control={form.control}
                name="dateRange"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="sr-only">Travel Dates</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full h-14 justify-start text-left font-normal",
                              !field.value?.from && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value?.from ? (
                              field.value.to ? (
                                <>
                                  {format(field.value.from, "LLL dd, y")} -{" "}
                                  {format(field.value.to, "LLL dd, y")}
                                </>
                              ) : (
                                format(field.value.from, "LLL dd, y")
                              )
                            ) : (
                              <span>Pick your travel dates</span>
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="center">
                        <Calendar
                          mode="range"
                          selected={field.value as DateRange}
                          onSelect={field.onChange}
                          numberOfMonths={2}
                          disabled={(date) => {
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            if (date < today) return true;

                            const from = field.value?.from;
                            const to = field.value?.to;

                            if (from && !to) {
                              const maxAllowed = addDays(from, 7);
                              return date < from || date > maxAllowed;
                            }

                            if (from && to) {
                              const maxAllowed = addDays(from, 7);
                              return date < from || date > maxAllowed;
                            }

                            return false;
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-3 w-full">
                <Button
                  type="button"
                  onClick={handleBack}
                  variant="outline"
                  size="lg"
                  className="flex-1"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button
                  type="button"
                  onClick={handleNext}
                  size="lg"
                  className="flex-1"
                >
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Interests */}
          {step === 3 && (
            <div className="space-y-6 animate-fade-in-up">
              <div className="text-center space-y-2">
                <Heart className="w-12 h-12 mx-auto text-primary" />
                <h2 className="text-3xl font-bold">What are your interests?</h2>
                <p className="text-muted-foreground">Select all that apply</p>
              </div>

              <FormField
                control={form.control}
                name="interests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="sr-only">Interests</FormLabel>
                    <FormControl>
                      <div className="grid grid-cols-2 gap-3">
                        {interestOptions.map((option) => (
                          <Button
                            key={option.value}
                            type="button"
                            variant="outline"
                            className={cn(
                              "h-auto py-4 flex-col gap-2 transition-all",
                              field.value?.includes(option.value) &&
                                "border-primary bg-primary/10 hover:bg-primary/20"
                            )}
                            onClick={() => {
                              const newValue = field.value?.includes(
                                option.value
                              )
                                ? field.value.filter((v) => v !== option.value)
                                : [...(field.value || []), option.value];
                              field.onChange(newValue);
                            }}
                          >
                            <span className="text-2xl">{option.icon}</span>
                            <span className="text-sm font-medium">
                              {option.label}
                            </span>
                          </Button>
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-3 w-full">
                <Button
                  type="button"
                  onClick={handleBack}
                  variant="outline"
                  size="lg"
                  className="flex-1"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button
                  type="submit"
                  size="lg"
                  className="flex-1 gradient-travel"
                >
                  Generate Itinerary
                </Button>
              </div>
            </div>
          )}
        </form>
      </Form>
    </Card>
  );
};

export default TravelPlanForm;
