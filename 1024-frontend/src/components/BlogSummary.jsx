import { Link } from 'react-router-dom';
import { articles } from '../data/blogArticles';
import { BlogSummaryIcon, RightArrowIcon } from '../components/Icons'

export function BlogSummary () {
    return (
        <section className="bg-white shadow-lg rounded max-w-8xl mx-auto p-10 mb-14">
            <div className='flex justify-between items-center mb-12'>
                <div className='flex items-center gap-2'>
                    <BlogSummaryIcon />
                    <h2 className="text-2xl font-bold">Últimas noticias</h2>
                </div>
                <div className='flex items-center gap-2'>
                    <Link to="/blog" className="text-green-500 hover:underline hover:decoration-green-500">Ver más</Link>
                    <RightArrowIcon />
                </div>
            </div>
            <div className="grid grid-cols-3 justify-center items-center gap-4">
                {articles.slice(0, 3).map((article, index) => (
                    <div key={index} className=" overflow-hidden">
                        <img src={article.image} alt={article.title} className="w-96 h-96 object-cover rounded hover:scale-125 transition-transform" />
                        <div className="p-4">
                            <h3 className="text-lg font-semibold">{article.title}</h3>
                            <p className="text-gray-600 text-sm mt-4">{article.content}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
