export default function Home() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Recipe App</h1>
      <div className="grid place-items-center">
        <div className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-md flex items-center space-x-4">
          <div>
            <div className="text-xl font-medium text-black">Welcome</div>
            <p className="text-gray-500">Your modern recipe application</p>
          </div>
        </div>
      </div>
    </div>
  )
}