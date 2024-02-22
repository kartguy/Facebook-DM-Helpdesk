export function Input({ type, place, name, onChange }) {
    return (
      <div className="p-2">
        <div>
          <h1 className="text-md font-bold mb-2">{name}</h1>
        </div>
        <div>
          <input
            placeholder={place}
            type={type}
            className="border-gray-200 border-2 text-sm w-full h-10 rounded-lg px-4 py-2 font-sans"
            onChange={onChange}
          />
        </div>
      </div>
    );
  }
  