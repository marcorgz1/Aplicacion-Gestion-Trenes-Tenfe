// Importar artículos del blog
import { articles } from '../data/blogArticles';

export function Blog() {
    return (
        <div className="max-w-4xl mx-auto p-6 mb-12">
            <h1 className="text-3xl font-bold mb-10 text-center">Blog de Noticias sobre Trenes</h1>
            <div className="grid grid-cols-1 gap-6">
                {articles.map((article, index) => (
                    <div key={index} className="flex bg-white shadow-lg rounded-lg overflow-hidden">
                        <img src={article.image} alt={article.title} className="w-1/3 object-cover" />
                        <div className="w-2/3 p-4 flex flex-col justify-between">
                            <h2 className="text-xl font-semibold">{article.title}</h2>
                            <p className="text-gray-600 text-sm line-clamp-2">{article.content}</p>
                            <button className="mt-2 bg-[#3a9956] hover:bg-green-700 text-white py-2 px-4 rounded">
                                Seguir leyendo
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
