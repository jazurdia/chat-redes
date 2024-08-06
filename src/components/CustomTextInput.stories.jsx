import CustomTextInput from "./CustomTextInput";

// Definición de la historia para CustomTextInput
export default {
    title: "Form/CustomTextInput",
    component: CustomTextInput,
};

// Definición de variaciones del componente
export const Default = () => <CustomTextInput label="Username" name="username" placeholder="Enter your username" />;

export const WithValue = () => <CustomTextInput label="Email" name="email" placeholder="Enter your email" value="user@example.com" onChange={() => {}} />;

export const Disabled = () => <CustomTextInput label="Disabled" name="disabled" placeholder="Cannot enter text" disabled />;
