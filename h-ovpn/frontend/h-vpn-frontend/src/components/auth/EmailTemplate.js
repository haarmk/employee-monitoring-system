import React, { useState } from 'react'
import AdminNavBar from './AdminNavBar'
import AdminSideBar from './AdminSideBar'
import "./EmailTemplate.css"
import { useLocation } from 'react-router-dom'
import axios from 'axios'
import { bakendBaseUrl, bakendHeader } from './BaseUrl'
import { useEffect } from 'react'

const EmailTemplate = () => {

    const location = useLocation();
    let id = location.state;
  

    const [emailTemplate, setEmailTemplate] = useState("");

    const [data, setData] = useState([])
    const onLoad = async () => {
        const response = await axios.get(`${bakendBaseUrl}/orders/admin-getAllOrders`, {
            headers: bakendHeader
        })
        setData(response.data)
    }

    useEffect(() => {
        onLoad();
    }, [])
    const [notFound, setNotFound] = useState("")
    const [newData, setNewData] = useState([])
    useEffect(() => {
        for (let a in data) {
            if (id.id === (data[a].razorpayOrderId)) {
                setNewData(data[a])
                break;
            }
            else {
                setNotFound("Data is not found for this order")
            }

        }

    }, [data])



    return (
        <div className="new-red">
            <div className="new-admin-foot">
                <AdminNavBar />
            </div>
            <div className="admin-home-container">
                <div className='admin-side-bar'>
                    <AdminSideBar />
                </div>
                <div className='Admin-dash-borad'>
                    <div class="container">
                        <div class="row">
                            <div class="col-lg-12">
                                <div class="card">
                                    <div class="card-body">
                                        <div class="invoice-title">
                                            <h4 class="float-end font-size-15">Order id- {newData.razorpayOrderId} <span class="badge bg-success font-size-12 ms-2">{newData.status}</span></h4>
                                            <div class="mb-4">
                                                <h2 class="mb-1 text-muted">HAARMK</h2>
                                            </div>
                                            <div class="text-muted">
                                                <p class="mb-1">  A-88, 3rd Floor, NCR, Block A, Sector 2, Noida, Uttar Pradesh 201301</p>
                                                <p class="mb-1"><i class="uil uil-envelope-alt"></i>haarmkinfotech@gmail.com</p>
                                                <p><i class="uil uil-phone"></i>+91 7045865031</p>
                                            </div>
                                        </div>

                                        <hr class="my-4" />

                                        <div class="row">
                                            <div class="col-sm-6">
                                                <div class="text-muted">
                                                    <h5 class="font-size-16 mb-3">Billed To:</h5>
                                                    <h5 class="font-size-15 mb-2">Preston Miller</h5>
                                                    <p class="mb-1">4068 Post Avenue Newfolden, MN 56738</p>
                                                    <p class="mb-1">PrestonMiller@armyspy.com</p>
                                                    <p>001-234-5678</p>
                                                </div>
                                            </div>

                                            <div class="col-sm-6">
                                                <div class="text-muted text-sm-end">
                                                    <div>
                                                        <h5 class="font-size-15 mb-1">Invoice No:</h5>
                                                        <p>#DZ0112</p>
                                                    </div>
                                                    <div class="mt-4">
                                                        <h5 class="font-size-15 mb-1">Invoice Date:</h5>
                                                        <p>12 Oct, 2020</p>
                                                    </div>
                                                    <div class="mt-4">
                                                        <h5 class="font-size-15 mb-1">Order No:</h5>
                                                        <p>#1123456</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="py-2">
                                            <h5 class="font-size-15">Order Summary</h5>

                                            <div class="table-responsive">
                                                <table class="table align-middle table-nowrap table-centered mb-0">
                                                    <thead>
                                                        <tr>
                                                            <th style={{ width: '70px' }}>No.</th>
                                                            <th>Item</th>
                                                            <th>Price</th>
                                                            <th>Quantity</th>
                                                            <th className="text-end" style={{ width: '120px' }}>Total</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <th scope="row">01</th>
                                                            <td>
                                                                <div>
                                                                    <h5 class="text-truncate font-size-14 mb-1">Black Strap A012</h5>
                                                                    <p class="text-muted mb-0">Watch, Black</p>
                                                                </div>
                                                            </td>
                                                            <td>$ 245.50</td>
                                                            <td>1</td>
                                                            <td class="text-end">$ 245.50</td>
                                                        </tr>
                                                        <tr>
                                                            <th scope="row">02</th>
                                                            <td>
                                                                <div>
                                                                    <h5 class="text-truncate font-size-14 mb-1">Stainless Steel S010</h5>
                                                                    <p class="text-muted mb-0">Watch, Gold</p>
                                                                </div>
                                                            </td>
                                                            <td>$ 245.50</td>
                                                            <td>2</td>
                                                            <td class="text-end">$491.00</td>
                                                        </tr>
                                                        <tr>
                                                            <th scope="row" colspan="4" class="text-end">Sub Total</th>
                                                            <td class="text-end">$732.50</td>
                                                        </tr>
                                                        <tr>
                                                            <th scope="row" colspan="4" class="border-0 text-end">
                                                                Discount :</th>
                                                            <td class="border-0 text-end">- $25.50</td>
                                                        </tr>
                                                        <tr>
                                                            <th scope="row" colspan="4" class="border-0 text-end">
                                                                Shipping Charge :</th>
                                                            <td class="border-0 text-end">$20.00</td>
                                                        </tr>
                                                        <tr>
                                                            <th scope="row" colspan="4" class="border-0 text-end">
                                                                Tax</th>
                                                            <td class="border-0 text-end">$12.00</td>
                                                        </tr>

                                                        <tr>
                                                            <th scope="row" colspan="4" class="border-0 text-end">Total</th>
                                                            <td class="border-0 text-end"><h4 class="m-0 fw-semibold">$739.00</h4></td>
                                                        </tr>

                                                    </tbody>
                                                </table>
                                            </div>
                                            <div class="d-print-none mt-4">
                                                <div class="float-end">
                                                    <a href="javascript:window.print()" class="btn btn-success me-1"><i class="fa fa-print"></i></a>
                                                    <a href="#" class="btn btn-primary w-md">Send</a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default EmailTemplate