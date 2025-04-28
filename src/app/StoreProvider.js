'use client'
import { useRef ,useEffect} from 'react'
import { Provider } from 'react-redux'
import { makeStore } from '@/redux/store'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { setUserDetails } from '@/redux/slicers/userSlice'
export default function StoreProvider({ children }) {
  const storeRef = useRef()
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore()
  }

  return <Provider store={storeRef.current}>
    <LoadData/>
    {children}</Provider>
}
const LoadData = ()=>{
  const dispatch = useAppDispatch();

    useEffect(() => {
      const fetchUserDetails = async () => {

          try {
            const response = await fetch('/api/users/profile');
            if (response.ok) {
              const data = await response.json();
              dispatch(setUserDetails(data));
            }
          } catch (error) {
            console.error("Error fetching user details:", error);
          } 
        
      };
  
      fetchUserDetails();
    }, [ dispatch]);
    return(
      <></>
    )
}