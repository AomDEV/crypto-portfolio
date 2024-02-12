export const ApiSchema = ({ name }) => {
    return (constructor) => {
        const wrapper = class extends constructor { };
        Object.defineProperty(wrapper, 'name', {
            value: name,
            writable: false,
        });
        return wrapper;
    }
}