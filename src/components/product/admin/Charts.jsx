import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell, ResponsiveContainer } from 'recharts';
import { collection, getDocs } from "firebase/firestore";
import { db } from '../../../../firebaseConfig';
import { useEffect, useState } from 'react';
import { div } from 'motion/react-client';
import RecentReviews from './RecentReviews';

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#a4de6c", "#d0ed57", "#8dd1e1", "#d88884"];

const fetchCategoryCounts = async () => {
    const snapshot = await getDocs(collection(db, "products"));
    const categoryCount = {};

    snapshot.forEach(doc => {
        const categories = doc.data().category; // Now handled as array
        if (Array.isArray(categories)) {
            categories.forEach(cat => {
                categoryCount[cat] = (categoryCount[cat] || 0) + 1;
            });
        }
    });

    return Object.entries(categoryCount).map(([name, value]) => ({ name, value }));
};

function Charts() {
    const [data, setData] = useState([]);

    useEffect(() => {
        const getData = async () => {
            const result = await fetchCategoryCounts();
            setData(result);
        };

        getData();
    }, []);

    return (
        <>
            <div className='row'>
                <div className='col-12 col-md-6'>


                    <div style={{ padding: '20px', backgroundColor: "white" }} className='text-center d-flex flex-column align-items-center justify-content-center' >
                        <h4>Products per Category</h4>
                        <ResponsiveContainer width={"100%"} height={400}>

                        <BarChart className='text-center mx-auto '
                            data={data}
                            margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
                            >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="name"
                                angle={-45}
                                textAnchor="end"
                                interval={0}
                                height={100}
                                label={{ value: 'Category', position: 'insideBottom', offset: -60 }}
                                />
                            <YAxis label={{ value: 'Products', angle: -90, position: 'insideLeft' }} />
                            <Tooltip />
                            <Bar dataKey="value">
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                                </ResponsiveContainer>
                    </div>
                </div>
                <div className='col-12 col-md-6'>
                                <RecentReviews/>
                </div>
            </div>
        </>
    );
}

export default Charts;
