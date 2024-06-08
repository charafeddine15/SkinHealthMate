import React, { useEffect, useState } from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';
import PageNotFound from 'app/shared/error/page-not-found';
import axios from 'axios';
import $ from 'jquery';
import 'jquery';
import 'datatables.net-dt/js/dataTables.dataTables';
import 'datatables.net-responsive-dt/js/responsive.dataTables';
import 'datatables.net-dt/css/jquery.dataTables.css';
import 'datatables.net-responsive-dt/css/responsive.dataTables.css';
import { useParams } from 'react-router-dom';
import '../style/styleTable.css';

interface ListPatientProps {
  nom: string;
  isAuthen: boolean;
  role: string[];
}

const Listpatient: React.FC<ListPatientProps> = props => {
  const { dermatologue_id } = useParams<{ dermatologue_id: string }>();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [progress, setProgress] = useState(0);

  const [doctor, setDoctor] = useState('');

  useEffect(() => {
    if (data.length > 0) {
      const table = $('#myTable').DataTable();
      return () => {
        table.destroy();
      };
    }
  }, [data]);

  useEffect(() => {
    axios
      .get('api/dermatologuePatients/' + dermatologue_id)
      .then(response => {
        console.log(response.data);
        setData(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.log(error.data);
      });
  }, [dermatologue_id]);

  useEffect(() => {
    axios
      .get('api/dermatologues/' + dermatologue_id)
      .then(response => {
        console.log(response.data.user);
        setDoctor(response.data.user.lastName + ' ' + response.data.user.firstName);
      })
      .catch(error => {
        console.log(error.data);
      });
  }, [dermatologue_id]);

  useEffect(() => {
    if (data.length > 0) {
      const table = $('#myTable').DataTable();
      return () => {
        table.destroy();
      };
    }
  }, [data]);
  if (props.isAuthen && (props.role.includes('ROLE_ADMIN') || props.role.includes('ROLE_SECRETAIRE'))) {
    return (
      <div>
        {loading ? (
          <div className="card flex justify-content-center">
            <ProgressSpinner />
          </div>
        ) : (
          <div className="card mt-2 p-2">
            <h4>Patients list for doctor : {doctor}</h4>
            <div className="mt-1 table-responsive">
              <table className="table card-table table-vcenter text-nowrap table-responsive" id="myTable">
                <thead>
                  <tr>
                    <th>First name</th>
                    <th>Last name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Address</th>
                  </tr>
                </thead>
                <tbody>
                  {data.length > 0 ? (
                    data.map((u, i) => (
                      <tr key={i}>
                        <td>{u.patient.user.firstName}</td>
                        <td>{u.patient.user.lastName}</td>
                        <td>{u.patient.user.email}</td>
                        <td>{u.patient.telephone}</td>
                        <td>{u.patient.adress}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="text-center" colSpan={5}>
                        No data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  }

  return <PageNotFound />;
};

export default Listpatient;
