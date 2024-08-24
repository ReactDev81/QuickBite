import Breadcrumb from "../../components/Ui/Breadcrumb"
import ProductCard from "./ProductCard"
import { useState, useEffect } from "react"
import axios from 'axios'
import ProductSkelaton from "./ProductSkelaton"

const Products = () => {

    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [isPaginationLoading, setIsPaginationLoading] = useState(false);
    const perPage = 8;

    useEffect(() => {

        setLoading(true);
        setIsPaginationLoading(true);

        axios.get(`${process.env.REACT_APP_WORDPRESS_SITE_URL}/wc/v3/products`, {
            auth: {
                'username': process.env.REACT_APP_WC_CONSUMER_KEY,
                'password': process.env.REACT_APP_WC_CONSUMER_SECRET
            },
            params: {
                per_page: perPage,
                page: currentPage
            }
        })
        .then((res) => {
            setProducts(res.data);
            const total = parseInt(res.headers['x-wp-total']);
            setTotalPages(Math.ceil(total / perPage));
            setLoading(false);
            setIsPaginationLoading(false);
        })
        .catch((err) => {
            console.log(err);
            setLoading(false);
            setIsPaginationLoading(false);
        })

    }, [currentPage])

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePageClick = (page) => {
        setCurrentPage(page);
    };

    return (
        <>
            <Breadcrumb />
            <section className="py-6 lg:py-16">
                <div className="max-w-screen-2xl w-full m-auto px-4">

                    {/* Loader */}
                    {loading ? (
                        <div className="grid gap-5 grid-cols-4">
                            {
                                Array(8).fill().map((_, index) => ( 
                                    <ProductSkelaton key={index} />
                                ))
                            }
                        </div>
                    ) : (
                        <>
                            {/* products */}
                            <div className="grid gap-5 grid-cols-4">
                                
                                {
                                    // products && 
                                    products.map((product, index) => {
                                        return(
                                            <ProductCard img={product.images[0].src} name={product.name} price={product.price} key={index} />
                                        )
                                    })
                                }
                                
                            </div>

                            {/* pagination */}
                            <div className="flex justify-between mt-10">

                                {/* Previous Button */}
                                <button 
                                    onClick={handlePreviousPage} 
                                    disabled={currentPage === 1}
                                    className={`rounded-lg bg-primary px-6 py-3 text-center text-sm font-medium text-white hover:bg-primary-500 w-fit ${currentPage === 1 && 'opacity-50 cursor-not-allowed'}`}
                                >
                                    Previous
                                </button>

                                {/* Page number buttons */}
                                <ul class="inline-flex items-center space-x-2 rounded-md text-sm">
                                    {Array.from({ length: totalPages }, (_, index) => (
                                        <li>
                                            <button 
                                                key={index + 1}
                                                onClick={() => handlePageClick(index + 1)} 
                                                className={`inline-flex h-9 w-9 items-center justify-center rounded-full bg-default-100 text-default-800 transition-all duration-500 hover:border-primary hover:bg-primary hover:text-white ${
                                                    currentPage === index + 1 && 'bg-primary text-white'
                                                }`}
                                            >
                                                {index + 1}
                                            </button>
                                        </li>
                                    ))}
                                </ul>

                                {/* Next Button */}
                                <button 
                                    onClick={handleNextPage} 
                                    disabled={currentPage === totalPages}
                                    className={`rounded-lg bg-primary px-6 py-3 text-center text-sm font-medium text-white hover:bg-primary-500 w-fit ${currentPage === totalPages && 'opacity-50 cursor-not-allowed'}`}
                                >
                                    Next
                                </button>
                            </div>

                        </>
                    )}
                </div>
            </section>
        </>
    )
}

export default Products