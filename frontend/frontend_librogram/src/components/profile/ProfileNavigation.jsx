import Sidebar from '../Sidebar'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import resume from '../../media/resume.png';
import library from '../../media/library.png';
import borrow from '../../media/borrow.png';
export default function ProfileNavigation() {
  return (
    <>
      <div className="overflow-hidden">
        <div className="row">
          <div className="col-2">
            <div className="position-fixed col-lg-2">
              <Sidebar />
            </div>
          </div>

          <div className="col-10 px-lg-5 px-2 ">

            <div className="row align-items-center min-vh-100 ">
              <div className="col-lg-6 px-5">
                <Link className='text-decoration-none text-black' to={`/myprofile`}>
                  <motion.div initial={{ scale: 0 }} animate={{ backgroundColor: '#ccd3ea', scale: 1 }}
                    transition={{ duration: 0.3 }} className=' book-item rounded shadow-sm mouse-pointer '>
                    <img className='profile-img-upload mx-auto d-block' src={resume} alt="" />
                    <p className='text-center pb-5 fs-3 fw-bold'>Info</p>
                  </motion.div>
                </Link>
              </div>
              <div className="col-lg-6 px-5">
                <Link className='text-decoration-none text-black' to={`/library-navigation`}>
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                    transition={{ delay: 0.3, duration: 0.3 }} className='bg-custom-blue book-item rounded shadow-sm mouse-pointer '>
                    <img className='profile-img-upload mx-auto d-block' src={library} alt="" />
                    <p className='text-center pb-5 fs-3 fw-bold'>My Library</p>
                  </motion.div>
                </Link>
              </div>
              <div className="col-lg-6 px-5">
                <Link className='text-decoration-none text-black' to={`/my-borrowings`}>
                  <motion.div initial={{ scale: 0 }} animate={{ backgroundColor: '#ccd3ea', scale: 1 }}
                    transition={{ duration: 0.3 }} className=' book-item rounded shadow-sm mouse-pointer '>
                    <img className='profile-img-upload mx-auto d-block' src={borrow} alt="" />
                    <p className='text-center pb-5 fs-3 fw-bold'>My Borrowings</p>
                  </motion.div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
