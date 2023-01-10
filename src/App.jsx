// import * as WebCredentialHandler from 'web-credential-handler';
import * as CredentialHandlerPolyfill from 'credential-handler-polyfill';
import { useEffect } from 'react';
import './App.css';
import Certificate from './templates/certificate';

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

    // Use Credential Handler API to store
    const result = await navigator.credentials.store(webCredentialWrapper);
    if (!result)
      document.getElementById('storeResults').innerText =
        'Storing credential...';

    document.getElementById('resultsPanel').classList.remove('hide');
    // document.getElementById('storeResults').innerText = JSON.stringify(
    //   result,
    //   null,
    //   2
    // );

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
    <div>
      <div className='flex flex-col justify-center items-center min-h-screen'>
        <div className='bg-white bg-opacity-70 rounded p-10 max-w-[70vw]'>
          <img
            src='https://upmsp.edu.in/images/logonamebig.png'
            className='w-[500px] mx-auto mb-8'
          />
          {/* <h1 className="text-5xl font-bold text-center mt-5">माध्यमिक शिक्षा परिषद्, उत्तर प्रदेश</h1> */}
          <p className='mt-8 text-center'>
            माध्यमिक शिक्षा परिषद्, उत्तर प्रदेश, प्रयागराज हाईस्कूल एवं
            इण्टरमीडिएट स्तर की परीक्षाओं को संचालित करने वाली विश्व की एक
            सर्वौच्च संस्था है। इस प्रगतिशील युग में नित नवीन तकनीक के उपयोग के
            बिना प्रगति की कल्पना भी नहीं की जा सकती है। माध्यमिक शिक्षा परिषद्
            द्वारा भी इसी पथ का अनुसरण करते हुए प्रथम बार अपने पारम्परिक परिवेश
            से बाहर निकल कर नवीन तकनीकी को अपनाते हुए शैक्षिक सत्र 2013-2014 से
            अग्रिम पंजीकरण की समस्त कार्यवाहियों को इस नवसृजित वेबसाइट के माध्यम
            से ऑनलाइन कराया गया, जो कि शतप्रतिशत सफल रहा था। इससे परिषदीय
            कार्यों की गुणवत्ता एवं विश्वसनीयता में आशातीत वृद्धि हुई। इस सफलता
            के लिये हम प्रदेश के समस्त शिक्षाधिकारियों एवं समस्त संस्थाओं के
            प्रधानाचार्यो आदि का विशेष आभार व्यक्त करते है।
          </p>
          <button
            id='receiveButton'
            className='bg-blue-800 hover:bg-blue-900 text-white font-medium pt-1 pb-2 px-4 rounded focus:outline-none focus:shadow-outline mb-5 mt-10 w-full text-lg'>
            Issue a Credential
          </button>
          <div className='card-panel hide' id='resultsPanel'>
            <Certificate />
            {/* <pre>
              <div id='storeResults'></div>
            </pre> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
