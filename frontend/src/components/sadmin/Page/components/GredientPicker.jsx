import React, { useState, useEffect } from 'react';
import { HexColorPicker } from 'react-colorful';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronDown } from 'lucide-react';

const GradientPicker = ({ value, onChange }) => {
  const [startColor, setStartColor] = useState('#000000');
  const [endColor, setEndColor] = useState('#000000');
  const [angle, setAngle] = useState(0);

  useEffect(() => {
    // Parse the initial gradient value
    const match = value.match(/linear-gradient\((\d+)deg,\s*(#[0-9A-Fa-f]{6}),\s*(#[0-9A-Fa-f]{6})\)/);
    if (match) {
      setAngle(parseInt(match[1]));
      setStartColor(match[2]);
      setEndColor(match[3]);
    }
  }, [value]);

  const handleStartColorChange = (color) => {
    setStartColor(color);
    updateGradient(color, endColor, angle);
  };

  const handleEndColorChange = (color) => {
    setEndColor(color);
    updateGradient(startColor, color, angle);
  };

  const handleAngleChange = (newAngle) => {
    setAngle(newAngle);
    updateGradient(startColor, endColor, newAngle);
  };

  const updateGradient = (start, end, deg) => {
    const gradientValue = `linear-gradient(${deg}deg, ${start}, ${end})`;
    onChange(gradientValue);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="space-y-4 p-4">
        <div className="flex justify-between space-x-4">
          <ColorPickerPopover
            label="Start Color"
            color={startColor}
            onChange={handleStartColorChange}
          />
          <ColorPickerPopover
            label="End Color"
            color={endColor}
            onChange={handleEndColorChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="angle">Angle: {angle}°</Label>
          <Slider
            id="angle"
            min={0}
            max={360}
            step={1}
            value={[angle]}
            onValueChange={(value) => handleAngleChange(value[0])}
          />
        </div>
        <div
          className="w-full h-24 rounded-lg shadow-inner transition-all duration-300 ease-in-out"
          style={{ background: value }}
        ></div>
      </CardContent>
    </Card>
  );
};

const ColorPickerPopover = ({ label, color, onChange }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          {label}
          <div className="flex items-center">
            <div
              className="w-6 h-6 rounded-full mr-2 border border-gray-300"
              style={{ backgroundColor: color }}
            />
            <ChevronDown className="h-4 w-4 opacity-50" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Card>
          <CardContent className="p-4">
            <HexColorPicker color={color} onChange={onChange} />
            <Input
              value={color}
              onChange={(e) => onChange(e.target.value)}
              className="mt-2"
            />
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
};

export default GradientPicker;
