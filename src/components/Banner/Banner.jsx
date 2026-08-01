import React, {useState} from 'react'
import { FaSearch, FaDownload, FaPlay, FaTimes } from "react-icons/fa";
import {images} from '../../data/imgdata'

const Banner = () => {

    const [searchQuery, setSearchQuery] = useState('');
    const[showVideo, setShowVideo] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        console.log('searching for: ', searchQuery)
    }
  return (
    <div className='relative'>
        <div className='bg-linear-to-br from-green-900 via-green-800
        to-green-700 text-white py-16 px-4 sm:px-8 relative overflow-hidden'>
            <div className='absolute inset-0 bg-linear-to-r
            from-green-900/20 to-green-700/10 '/>
            <div className='max-w-6xl mx-auto flex flex-col md:flex-row
            items-center gap-12 relative z-10'>
                {/* LEFT CONTENT */}
                <div className='flex-1 space-y-8 relative md:pr-8 lg:pr-19
                text-center md:text-left'>
                    <h1 className='text-4xl sm:text-5xl md:text-4xl lg:text-6xl
                    font-bold leading-tight font-serif drop-shadow-md'>
                        African Excellence <br/>
                        <span className='text-green-400 bg-linear-to-r from-green-400
                        to-yellow-300 bg-clip-text'>
                            served in a dish.
                        </span>
                    </h1>
                    <p className='text-lg md:text-lg lg:text-xl font-playfair
                    italic sm:text-xl text-green-100'>
                        where every plate tells a story of culture, flavor, and tradition.
                        From the aroma to your first bite, our dishes craft an
                        unforgettable memory...leaving you wanting more. 
                    </p>

                    <form onSubmit={handleSearch} className='relative max-w-2xl
                    mx-auto md:mx-0 group'>
                        <div className='relative flex items-center bg-green-900/30
                        rounded-xl border-2 border-green-500/30 shadow-2xl hover:bg-green-700/90
                        transition-all duration-300'>
                            <div className='pl-6 pr-3 py-4'>
                            <FaSearch className='text-xl text-green-400/80'/>
                            </div>
                            <input type='text' value={searchQuery} 
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder='Discover your next favourite meal...'
                            className='w-full py-4 pr-6 bg-transparent outline-none
                            placeholder-white text-lg font-medium tracking-wide'/>
                            <button type="submit" className=' mr-4 px-6
                            py-3 bg-linear-to-r from-green-400 to-green-300
                            rounded-lg font-semibold text-green-900
                            hover:from-green-300 hover:to-green-200
                            transition-all duration-300 shadow-lg hover:shadow-green-300/20'>
                                Search</button>
                        </div>
                    </form>
                    <div className='flex flex-wrap gap-4 justify-center md:justify-start
                    mt-6'>
                        <button className='group flex items-center gap-3
                        bg-green-800/30 hover:bg-green-800/50 px-6
                        py-3 rounded-xl transition-all duration-300 border-2
                        border-green-700/50 hover:border-green-400 backdrop-blur-sm
                        '>
                            <FaDownload className='text-xl text-green-400 group:hover:animate-bounce'/>
                            <span className='text-lg'>Download App</span>
                        </button>

                        <button onClick={()=>setShowVideo(true)}className='group flex items-center gap-3 bg-linear-to-r
                        from-green-400 to-green-300 hover:from-green-300
                        hover:to-green-200 px-6 py-3 rounded-xl transition-all
                        duration-300 shadow-lg hover:shadow-green-300/30'>
                            <FaPlay className='text-xl text-green-900'/>
                            <span className='text-lg text-green-900 font-semibold'>Watch Video</span>

                        </button>
                    </div>
                </div>
                {/* RIGHT IMAGES CONTAINER WITH ORBITAL IMAGES */}
                <div className='flex-1 relative group mt-8 md:mt-0 min-h-[300px]
                sm:min-h-[400px]'>
                    {/* MAIN IMG */}
                    <div className='relative rounded-full p-1 bg-linear-to-br
                    from-green-700 via-green-800 to-green-400
                    shadow-2xl z-20 w-[250px] xs:w-[300px] sm:w-[350px]
                    h-[250px] xs:h-[300px] sm:h-[350px] mx-auto'>
                        <img src={images.eko_center} alt="Banner" className='rounded-full
                        border-4 xs:border-8 border-green-900/50 w-full h-full
                        object-cover object-top'/>

                    </div>
                    {/* ORBITAL IMAGES */}
                    {images.orbitImages.map((img, index) => (
                        <div
                            key={index}
                            style={{ animationDelay: `-${index * 5}s` }}
                            className="absolute left-1/2 top-1/2 -translate-x-1/2
                            -translate-y-1/2 orbit w-[80px] xs:w-[100px] sm:w-[150px]
                            h-[80px] xs:h-[100px] sm:h-[150px]">
                                <img src={img} alt={`Orbiting ${index}`} className='w-full h-full
                                rounded-full border border-green-500/30 shadow-lg bg-green-900/20
                                p-1 object-cover'/>
                            </div>
                    ))}
                </div>
            </div>
        </div>
        {/* VIDEO MODAL */}
        {showVideo && (
            <div className='fixed inset-0 bg-black/70 z-50 flex items-center justify-center backdrop-blur-lg p-4'>
                <button onClick={()=>setShowVideo(false)}
                    className='absolute top-6 right-6 text-green-400
                    hover:text-green-300 text-3xl z-10 transition-all'>
                    <FaTimes/>
                </button>
                <div className='w-full max-w-4xl mx-auto'>
                    <video controls autoPlay className='w-full aspect-video object-contain rounded-lg
                    shadow-2xl'>
                        <source src={images.eko_video} type="video/mp4"/>
                    </video>

                </div>
            </div>
            )}


    </div>
  )
}

export default Banner