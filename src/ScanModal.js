import { useState } from 'react';
import {
  ModalContent,
  ModalFooter,
  ModalButton,
  useDialog,
} from 'react-st-modal';
import QrReader from 'react-qr-reader';
import { utils } from 'near-api-js';
import './ScanModal.css';

const ScanModal = (props) => {
  const { sweeper, receiver } = props;
  const dialog = useDialog();
  const [loading, setLoading] = useState(false);
  const [facing, setFacing] = useState('environment');
  const [paper, setPaper] = useState('');
  const [key, setKey] = useState('');
  const [balance, setBalance] = useState('');

  const allNotEmpty = (arr) => arr.every((e) => e !== '');

  const handleChangeMode = () => {
    setFacing(facing === 'user' ? 'environment' : 'user');
  };

  const handleScan = async (data) => {
    if (data) {
      const splitString = data.split(':');
      if (allNotEmpty(splitString)) {
        setPaper(splitString[0]);
        setKey(splitString[1]);
        setLoading(true);
        try {
          const paperBalance = await sweeper.balance(
            splitString[0],
            splitString[1]
          );
          const numericBalance = utils.format.formatNearAmount(paperBalance, 6);
          setBalance(numericBalance);
        } catch (error) {
          console.log(error);
        }
        setLoading(false);
      }
    }
  };

  const handleError = (err) => {
    console.error(err);
  };

  return (
    <>
      <ModalContent className="qr-container">
        <div>
          Facing Mode: {facing}
          <button className="change-button" onClick={handleChangeMode}>
            Change
          </button>
        </div>
        <div className="qr-scanner">
          <QrReader delay={300} onError={handleError} onScan={handleScan} />
        </div>
        <table id="qr-result">
          <tbody>
            <tr>
              <th>Wallet:</th>
              <td>{paper}</td>
            </tr>
            <tr>
              <th>Key:</th>
              <td>{key === '' ? '' : `${key.substring(1, 27)}...`}</td>
            </tr>
            <tr>
              <th>Balance:</th>
              <td>{loading ? 'loading...' : balance}</td>
            </tr>
            <tr>
              <th>Receiver:</th>
              <td>{receiver}</td>
            </tr>
          </tbody>
        </table>
      </ModalContent>
      <ModalFooter>
        <ModalButton
          onClick={() => {
            dialog.close(`${paper}:${key}`);
          }}
        >
          Sweep
        </ModalButton>
        <ModalButton
          type="dark"
          onClick={() => {
            dialog.close();
          }}
        >
          Close
        </ModalButton>
      </ModalFooter>
    </>
  );
};

export default ScanModal;
