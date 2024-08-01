import React, { useEffect, useRef, useState } from 'react';
import QrScanner from 'qr-scanner';
import axios from 'axios';
import QrFrame from '../assets/qr-frame.png';
import { toastifyOption } from '../constant';
import { toast, ToastContainer } from 'react-toastify';

const QrVerifier = () => {
    const scanner = useRef(null);
    const videoEl = useRef(null);
    const qrBoxEl = useRef(null);
    const [qrOn, setQrOn] = useState(true);
    const [loading, setLoading] = useState(false)
    const [isAllow,setIsAllow]=useState('')
   const [error,setError]=useState(false)

    // start stop handler
    const stopScan = () => {
        scanner?.current?.stop();
    }
    const startScan = () => {
        scanner.current.start();
    }

    const handleVerifyQr = async (qrCodeData) => {
        setLoading(true)
        try {
            const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/vol/verify-qr`, { qrCodeData }, {
                withCredentials: true,
            })
            console.log(data)
            setError(false)
            toast.success(data.message,toastifyOption)
            setIsAllow(data.message)
        } catch (error) {
            console.log(error)
            setError(true)
            setIsAllow(error.response.data.message)
            toast.error(error.response.data.message, toastifyOption)
        } finally {
            setLoading(false)
            setTimeout(()=>startScan(),2000);
        }

    }
    // Success
    const onScanSuccess = (result) => {
        console.log(result)
        stopScan();
        handleVerifyQr(result.data);
       
    };

    // Fail
    const onScanFail = (err) => {
        //setError(true)
        console.log("error", err);
    };

    useEffect(() => {
        if (videoEl?.current && !scanner.current) {
            scanner.current = new QrScanner(videoEl?.current, onScanSuccess, {
                onDecodeError: onScanFail,
                preferredCamera: 'enviorment',
                highlightScanRegion: true,
                highlightCodeOutline: true,
                overlay: qrBoxEl?.current || undefined,
            });

            scanner?.current?.start()
                .then(() => setQrOn(true))
                .catch((err) => {
                    if (err) setQrOn(false);
                });
        }

        return () => {
            if (!videoEl?.current) {
                scanner?.current?.stop();
            }
        };
    }, []);

    return (
        <>
            <h1>QR Verifier</h1>
            <h3 style={{color:error?'red':'green'}}>{isAllow}</h3>
            <ToastContainer/>
            <button onClick={startScan}>Start Scan</button>
            <button onClick={stopScan}>Stop Scan</button>
            <div style={{
                width: '430px',
                height: '100vh',
                margin: '0 auto',
                position: 'relative',
            }}>
                <video ref={videoEl} style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                }}></video>
                <div ref={qrBoxEl} style={{
                    width: '100% !important',
                    left: '0 !important',
                }}>
                    <img
                        src={QrFrame}
                        alt="QR Frame"
                        width={256}
                        height={256}
                        style={{
                            position: 'absolute',
                            fill: 'none',
                            left: '50%',
                            top: '50%',
                            transform: 'translateX(-50%) translateY(-50%)',
                        }}
                    />
                </div>
            </div>
        </>
    );
};

export default QrVerifier;


