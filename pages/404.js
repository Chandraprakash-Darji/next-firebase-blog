import Link from "next/link";
const Cuestom404 = () => {
    return (
        <main>
            <h1>404 - That page does not seem to exist...</h1>
            <iframe
                src="https://giphy.com/embed/PIBuZutkhuKqV09TEf"
                width="480"
                height="426"
                frameBorder="0"
            ></iframe>
            
            <Link href="/">
                <button className="btn-blue">Go Home</button>
            </Link>
        </main>
    );
};

export default Cuestom404;
