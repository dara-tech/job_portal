import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const InputField = ({ icon: Icon, name, label, value, onChange, type = "text", required = false }) => (
    <div className="space-y-2">
      <Label htmlFor={name} className="flex items-center gap-2 text-primary">
        <Icon size={16} />
        {label}
      </Label>
      <Input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={label}
        className="w-full bg-gray-800 dark:bg-gray-900 border-gray-700 dark:border-gray-800 focus:ring-primary dark:focus:ring-primary"
        required={required}
      />
    </div>
  );

  export default InputField;