import abel from '@/assets/abel.png';
import tiago from '@/assets/tiago.png';
import luis from '@/assets/luis.png';
import jose from '@/assets/jose.png';

export function Component() {
    const members = [
        { name: 'Abel Teixeira', email: 'abel.teixeira@ua.pt', github: 'https://github.com/ttabelhaxd', image: abel },
        { name: 'Tiago Lopes', email: 'tiagoflopes@ua.pt', github: 'https://github.com/tiagoflopes', image: tiago },
        { name: 'Luís Godinho', email: 'luis.godinho13@ua.pt', github: 'https://github.com/luis-godinho', image: luis },
        { name: 'José Marques', email: 'jpfmarques@ua.pt', github: 'https://github.com/Jose-Pedro-Ferreira-Marques', image: jose },
    ];

    return (
        <main className="p-8">
            <h1 className="text-center font-black text-5xl m-10">Contacts</h1>
            <div className="text-center mb-10">
                <h2 className="text-3xl font-semibold">Universidade de Aveiro</h2>
                <p className="text-xl">Departamento de Eletrónica, Telecomunicações e Informática</p>
                <p className="text-lg">Email: deti-sec@ua.pt</p>
                <p className="text-lg">Phone: +351 234 370 355</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {members.map((member, index) => (
                    <div key={index} className="bg-white shadow-md rounded-lg overflow-hidden text-center transform transition-transform duration-300 hover:scale-105 hover:shadow-lg">
                        <img src={member.image} alt={member.name} className="w-32 h-32 object-cover rounded-full mx-auto mt-4" />
                        <div className="p-4">
                            <h2 className="text-xl font-semibold">{member.name}</h2>
                            <p className="text-gray-500">{member.email}</p>
                            <a href={member.github} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">GitHub</a>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
}