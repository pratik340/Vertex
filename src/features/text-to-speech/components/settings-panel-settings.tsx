"use client";

import { useStore } from "@tanstack/react-form";

import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Slider } from "@/components/ui/slider";
import { useTypedAppFormContext } from "@/hooks/use-app-form";

import { sliders } from "@/features/text-to-speech/data/slider";
import { ttsFormOptions } from "@/features/text-to-speech/components/text-to-speech-form";
import { VoiceSelector } from "@/features/dashboard/components/voice-selector";

export function SettingsPanelSettings() {
    const form = useTypedAppFormContext(ttsFormOptions);
    const isSubmitting = useStore(form.store, (s) => s.isSubmitting);
    return(
        <>
        {/* voice style dropdown selection */}

        <div className="border-b border-dashed p-4">
           <VoiceSelector/>
        </div>

        {/* Voice Adjustment Section */}
        <div className="p-4 flex-1">
        <FieldGroup className="gap-8">
            {sliders.map((slider) => (
                <form.Field key={slider.id} name={slider.id}>
                   {(field)=>(
                    <Field>
                        <FieldLabel>{slider.label}</FieldLabel>
                        <div className="flex items-center justify-between">
                         <span className="text-xs text-muted-foreground">
                            {slider.leftLabel}
                         </span>
                         <span className="text-xs text-muted-foreground">
                            {slider.rightLabel}
                         </span>
                        </div>
                        <Slider
                        value={[field.state.value]}
                        onValueChange={(value) => field.handleChange(value[0])}
                        min={slider.min}
                        max={slider.max}
                        disabled={isSubmitting}
                         step={slider.step}
                         className="**:data-[slot=slider-thumb]:size-3 **:data-[slot=slider-thumb]:bg-foreground **:data-[slot=slider-track]:h-1"
                        />
                    </Field>
                   )}
                </form.Field>
            ))}
        </FieldGroup>
        </div>
        </>
    )
}