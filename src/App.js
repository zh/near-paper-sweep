import { useState, useEffect } from 'react';
import { CustomDialog } from 'react-st-modal';
import ScanModal from './ScanModal';
import PaperWallet from './PaperWallet';

function App(props) {
  const { near, nearConfig, wallet } = props;
  const [sweeper, setSweeper] = useState(null);
  const [receiver, setReceiver] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState('');

  const allNotEmpty = (arr) => arr.every((e) => e !== '');

  const handleScan = async () => {
    if (!sweeper || !receiver || receiver === '') return;
    setDone('');

    try {
      const sweepStr = await CustomDialog(
        <ScanModal sweeper={sweeper} receiver={receiver} />,
        {
          title: 'Scan QR code',
          showCloseIcon: true,
        }
      );
      if (sweepStr) {
        const splitStr = sweepStr.split(':');
        if (splitStr.length !== 2 || !allNotEmpty(splitStr)) return;
        // maybe need fix for mainnet -> near
        const fixedReceiver = receiver.endsWith(`.${nearConfig.accountEnd}`)
          ? receiver
          : `${receiver}. ${nearConfig.accountEnd}`;
        setLoading(true);
        setDone('Sending ...');
        await sweeper.sweep(splitStr[0], splitStr[1], fixedReceiver);
        setDone('Done.');
      } else {
        console.log('no sweep data');
      }
    } catch (error) {
      console.log('sweep: ', error);
      setDone('');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      setSweeper(new PaperWallet({ near, wallet }));
    })();
  }, [wallet, near]);

  return (
    <div className="App">
      <header className="App-header">
        <h3>NEAR Paper Wallets Sweeper</h3>
      </header>
      {sweeper && (
        <>
          <h3>Receiver</h3>
          <div>
            <input
              type="text"
              value={receiver}
              onChange={(e) => {
                setReceiver(e.target.value);
              }}
            />
          </div>
          <h3>Press to scan</h3>
          <div>
            <button disabled={loading} onClick={() => handleScan()}>
              Scan QR code
            </button>
          </div>
          <h3 style={{ color: 'green' }}>{done}</h3>
        </>
      )}
      <footer className="App-footer">
        Sources on{' '}
        <a
          href="https://github.com/zh/near-paper-sweep"
          target="_blank"
          rel="noopener noreferrer"
        >
          Github
        </a>
      </footer>
    </div>
  );
}

export default App;
