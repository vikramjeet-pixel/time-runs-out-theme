
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface SettingsFormProps {
  birthdate: Date;
  setBirthdate: (date: Date) => void;
  lifeExpectancy: number;
  setLifeExpectancy: (years: number) => void;
  displayUnit: string;
  setDisplayUnit: (unit: string) => void;
}

export function SettingsForm({
  birthdate,
  setBirthdate,
  lifeExpectancy,
  setLifeExpectancy,
  displayUnit,
  setDisplayUnit,
}: SettingsFormProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Timer Settings</CardTitle>
        <CardDescription>
          Configure your death timer parameters
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="birthdate">Date of Birth</Label>
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !birthdate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {birthdate ? format(birthdate, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={birthdate}
                onSelect={(date) => {
                  if (date) {
                    setBirthdate(date);
                    setIsOpen(false);
                  }
                }}
                initialFocus
                disabled={(date) =>
                  date > new Date() || date < new Date("1900-01-01")
                }
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="life-expectancy">Life Expectancy (years)</Label>
            <span className="text-sm">{lifeExpectancy} years</span>
          </div>
          <Slider
            id="life-expectancy"
            defaultValue={[lifeExpectancy]}
            min={50}
            max={120}
            step={1}
            onValueChange={(value) => setLifeExpectancy(value[0])}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="display-unit">Display Unit</Label>
          <Select
            value={displayUnit}
            onValueChange={(value) => setDisplayUnit(value)}
          >
            <SelectTrigger id="display-unit">
              <SelectValue placeholder="Select unit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="years">Years, Months, Days</SelectItem>
              <SelectItem value="days">Days</SelectItem>
              <SelectItem value="hours">Hours</SelectItem>
              <SelectItem value="minutes">Minutes</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
