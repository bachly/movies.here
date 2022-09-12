export default function Container({ children }) {
    return <div className="px-4 lg:px-12 max-w-2xl mx-auto xl:max-w-none">
        {children}
    </div>
}