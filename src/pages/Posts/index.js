import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SkeletonLoader from './PostSkeletonLoader';
import Breadcrumb from '../../components/Ui/Breadcrumb';

const Posts = () => {

    const [posts, setPosts] = useState([]);
    const [featuredImage, setFeaturedImage] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_ROOT}/posts`)
            .then((res) => {
                setPosts(res.data);

                // Track the number of completed fetch requests for featured images
                let fetchCount = 0;
                const totalFetches = res.data.filter(post => post.featured_media).length;

                // Fetch featured images for each post
                res.data.forEach((post) => {
                    if (post.featured_media) {
                        axios.get(`${process.env.REACT_APP_API_ROOT}/media/${post.featured_media}`)
                            .then((mediaRes) => {
                                setFeaturedImage(prevState => ({
                                    ...prevState,
                                    [post.id]: mediaRes.data.source_url
                                }));

                                fetchCount++;
                                if (fetchCount === totalFetches) {
                                    setLoading(false);
                                }
                            })
                            .catch((mediaErr) => {
                                console.log(mediaErr);

                                fetchCount++;
                                if (fetchCount === totalFetches) {
                                    setLoading(false);
                                }
                            });
                    } else {
                        // If no featured media, increment the fetchCount
                        fetchCount++;
                        if (fetchCount === totalFetches) {
                            setLoading(false);
                        }
                    }
                });
            })
            .catch((err) => {
                console.log(err);
                setLoading(false);
            });
    }, []);


    return (
        <>
            <Breadcrumb />
            <div className="max-w-screen-2xl m-auto py-12 px-4">
                <div className="posts flex gap-4">
                    {loading ? 
                        Array(3).fill().map((_, index) => ( 
                            <SkeletonLoader key={index} />
                        ))
                    : posts.map((post, index) => (
                            <div className="w-1/3 bg-white border border-default-200 rounded-lg" key={index}>
                                <Link to={`/posts/${post.id}`}>
                                    {featuredImage[post.id] && (
                                        <img className="rounded-t-lg w-full h-64 object-cover" src={featuredImage[post.id]} alt={post.title.rendered} />
                                    )}
                                </Link>
                                <div className="p-5">
                                    <Link to={`/posts/${post.id}`}>
                                        <h4 className="line-clamp-2 text-2xl font-semibold text-default-800">{post.title.rendered}</h4>
                                    </Link>
                                    <div className="mt-2 mb-4 line-clamp-5 max-w-2xl text-base text-default-600" dangerouslySetInnerHTML={{__html: post.content.rendered}} />
                                    <Link to={`/posts/${post.id}`} className="inline-flex items-center rounded-lg bg-primary px-6 py-3 text-center text-sm font-medium text-white shadow-sm transition-all duration-300 hover:bg-primary-500 w-fit">
                                        Read more
                                    </Link>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </>
    );
}

export default Posts;