import React from "react";
import Head from "next/head";
const Metatag = ({ title, description, image }) => {
    return (
        <Head>
            <title>{title}</title>
            <meta name="twitter:card" content="summary" />
            <meta name="twitter:site" content="@chandra_7852" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />

            <meta name="og:title" content={title} />
            <meta name="og:description" content={description} />
            <meta name="og:image" content={image} />
        </Head>
    );
};

export default Metatag;
