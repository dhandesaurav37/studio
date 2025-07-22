
"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Star } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useStore } from "@/hooks/use-store";

const faqs = [
  {
    question: "What are your shipping options?",
    answer:
      "We offer standard and express shipping options. Standard shipping usually takes 5-7 business days, while express shipping takes 2-3 business days. Shipping costs are calculated at checkout based on your location and the weight of your order.",
  },
  {
    question: "What is your return policy?",
    answer:
      "We accept returns within 7 days of delivery for a full refund or exchange. Items must be in their original condition, unworn, and with all tags attached. To initiate a return, please visit your 'My Orders' page.",
  },
  {
    question: "How can I track my order?",
    answer:
      "Once your order is shipped, you will receive an email with a tracking number and a link to the courier's website. You can also find your tracking information in the 'My Orders' section of your account.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit and debit cards, UPI, net banking through Razorpay, as well as Cash on Delivery (COD) for eligible orders.",
  },
  {
    question: "How do I know what size to order?",
    answer:
      "You can find a size chart on each product page. We recommend measuring a garment you own that fits well and comparing it to our chart to find the perfect size.",
  },
];

export default function FaqPage() {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const { averageRating, totalRatings, submitRating } = useStore();

  const handleRatingSubmit = () => {
    if (rating === 0) {
      toast({
        title: "No rating selected",
        description: "Please select a star rating before submitting.",
        variant: "destructive",
      });
      return;
    }

    submitRating(rating);

    toast({
      title: "Thank you for your feedback!",
      description: `You gave us a rating of ${rating} out of 5.`,
    });
    setIsDialogOpen(false);
    setRating(0);
  };

  return (
    <div className="py-8 md:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold font-headline">
            Frequently Asked Questions
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Have a question? We're here to help.
          </p>
          <div className="flex items-center justify-center gap-4 mt-6">
            <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-6 w-6 ${
                        i < Math.round(averageRating)
                          ? "text-amber-400 fill-amber-400"
                          : "text-muted-foreground/30"
                      }`}
                    />
                ))}
            </div>
            <p className="text-muted-foreground">
                <span className="font-bold text-foreground">{averageRating.toFixed(1)}</span> ({totalRatings} ratings)
            </p>
          </div>
        </div>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-lg text-left">{faq.question}</AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <div className="text-center mt-12">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" variant="outline">Rate Our App</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="font-headline">Give us your feedback</DialogTitle>
                <DialogDescription>
                  How was your experience using our app? Let us know by
                  leaving a rating below.
                </DialogDescription>
              </DialogHeader>
              <div className="flex justify-center items-center gap-2 py-4">
                {[...Array(5)].map((_, index) => {
                  const starValue = index + 1;
                  return (
                    <Star
                      key={starValue}
                      className={`h-10 w-10 cursor-pointer transition-colors ${
                        starValue <= (hoverRating || rating)
                          ? "text-amber-400 fill-amber-400"
                          : "text-muted-foreground/50"
                      }`}
                      onClick={() => setRating(starValue)}
                      onMouseEnter={() => setHoverRating(starValue)}
                      onMouseLeave={() => setHoverRating(0)}
                    />
                  );
                })}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button type="submit" onClick={handleRatingSubmit}>Submit Rating</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
