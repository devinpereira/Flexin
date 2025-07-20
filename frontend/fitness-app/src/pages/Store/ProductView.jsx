import React, { useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

const ProductViewPage = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Redirect to store with product view active to maintain layout consistency
        console.log('Redirecting standalone ProductView to Store layout with product view');
        navigate('/store', {
            state: {
                activeView: 'product',
                selectedProduct: location.state?.product,
                productId: productId
            },
            replace: true
        });
    }, [productId, navigate, location.state?.product]);

    // Show loading while redirecting
    return (
        <div className="min-h-screen bg-cover bg-center bg-fixed flex items-center justify-center"
            style={{ background: 'linear-gradient(180deg, #0A0A1F 0%, #1A1A2F 100%)' }}>
            <div className="text-white text-center">
                <div className="w-8 h-8 border-4 border-[#f67a45] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p>Loading product...</p>
            </div>
        </div>
    );
};

export default ProductViewPage;
