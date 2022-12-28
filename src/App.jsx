// import * as WebCredentialHandler from 'web-credential-handler';
import * as CredentialHandlerPolyfill from 'credential-handler-polyfill';
import { useEffect } from 'react';
import './App.css';

function App() {
  const MEDIATOR =
    'https://authn.io/mediator' +
    '?origin=' +
    encodeURIComponent(window.location.origin);

  const testCredential = {
    '@context': [
      'https://www.w3.org/2018/credentials/v1',
      'https://www.w3.org/2018/credentials/examples/v1',
    ],
    id: 'http://example.edu/credentials/1872',
    type: ['VerifiableCredential', 'UniversityDegreeCredential'],
    issuer: 'https://example.edu/issuers/565049',
    issuanceDate: '2010-01-01T19:53:24Z',
    credentialSubject: {
      id: 'did:example:ebfeb1f712ebc6f1c276e12ec21',
      alumniOf: {
        id: 'did:example:c276e12ec21ebfeb1f712ebc6f1',
        name: {
          '@value': 'Example University',
          '@language': 'en',
        },
      },
    },
    proof: {
      type: 'Ed25519Signature2018',
      created: '2017-06-18T21:19:10Z',
      proofPurpose: 'assertionMethod',
      verificationMethod: 'https://example.edu/issuers/keys/1',
      jws: 'eyJhbGciOiJSUzI1NiIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..TCYt5XsITJX1CxPCT8yAV-TVkIEq_PbChOMqsLfRoPsnsgw5WEuts01mq-pQy7UJiN5mgRxD-WUcX16dUEMGlv50aqzpqh4Qktb3rk-BuQy72IFLOqV0G_zS245-kronKb78cPN25DGlcTwLtjPAYuNzVBAh4vGHSrQyHUdBBPM',
    },
  };

  const testPresentation = {
    '@context': [
      'https://www.w3.org/2018/credentials/v1',
      'https://www.w3.org/2018/credentials/examples/v1',
    ],
    type: 'VerifiablePresentation',
    verifiableCredential: [testCredential],
  };

  async function onClickReceive() {
    // document.getElementById('storeResults').innerHTML = ''; // clear results

    // Construct the WebCredential wrapper around the credential to be stored
    const credentialType = 'VerifiablePresentation';
    const webCredentialWrapper = new CredentialHandlerPolyfill.WebCredential(
      credentialType,
      testPresentation,
      {
        recommendedHandlerOrigins: ['https://wallet.example.chapi.io/'],
      }
    );

    document.getElementById('storeResults').innerText = 'Storing credential...';

    // Use Credential Handler API to store
    const result = await navigator.credentials.store(webCredentialWrapper);

    document.getElementById('resultsPanel').classList.remove('hide');
    document.getElementById('storeResults').innerText = JSON.stringify(
      result,
      null,
      2
    );

    console.log('Result of receiving via store() request:', result);
    //
    // if(!result) {
    //   document.getElementById('storeResults').innerHTML = 'null result';
    //   return;
    // }

    // document.getElementById('storeResults').innerHTML = JSON.stringify(result.data, null, 2);
  }

  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  useEffect(() => {
    CredentialHandlerPolyfill.loadOnce(MEDIATOR)
      .then(console.log('Polyfill loaded.'))
      .catch((e) => console.error('Error loading polyfill:', e));

    ready(() => {
      document
        .getElementById('receiveButton')
        .addEventListener('click', onClickReceive);
      console.log('Document ready.');
    });
  });

  return (
    <div className='container'>
      <div className='card-panel'>
        <h5>Demo Issuer</h5>
        <p>
          If you have not yet picked a wallet and registered it with your
          browser, try out the
          <a href='https://localhost:3000/'> Demo Wallet</a>.
        </p>

        <p>
          This is a minimal credential Issuer application that demonstrates how
          a user would ask for a credential to be issued.
        </p>

        <p>
          When you click the Store() button, a Verifiable Credential will be
          issued and sent to your digital wallet for storage.
        </p>

        <button className='waves-effect waves-light btn' id='receiveButton'>
          Issue and Store() a Credential
        </button>
      </div>

      <div className='card-panel hide' id='resultsPanel'>
        <h6>Result of store() operation:</h6>

        <pre>
          <code id='storeResults'></code>
        </pre>
      </div>
    </div>
  );
}

export default App;
