import abel from '@/assets/abel.png';
import tiago from '@/assets/tiago.png';
import luis from '@/assets/luis.png';
import jose from '@/assets/jose.png';

export function Component() {
    const creators = [
        { name: 'Abel Teixeira', github: 'https://github.com/ttabelhaxd', image: abel, role: 'Product Owner' },
        { name: 'Tiago Lopes', github: 'https://github.com/tiagoflopes', image: tiago, role: 'DevOps' },
        { name: 'Luís Godinho', github: 'https://github.com/luis-godinho', image: luis, role: 'Architect' },
        { name: 'José Marques', github: 'https://github.com/Jose-Pedro-Ferreira-Marques', image: jose, role: 'Team Manager' },
    ];

    return (
        <main className="p-8">
            <h1 className="text-center font-black text-5xl m-10">About Us</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {creators.map((creator, index) => (
                    <div key={index} className="bg-white shadow-md rounded-lg overflow-hidden text-center transform transition-transform duration-300 hover:scale-105 hover:shadow-lg">
                        <a href={creator.github} target="_blank" rel="noreferrer">
                        <img src={creator.image} alt={creator.name} className="w-32 h-32 object-cover rounded-full mx-auto mt-4" />
                        <div className="p-4">
                            <h2 className="text-xl font-semibold">{creator.name}</h2>
                            <p className="text-gray-500">{creator.role}</p>
                        </div>
                        </a>
                    </div>
                ))}
            </div>
        </main>
    );
}