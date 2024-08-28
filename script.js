document.addEventListener('DOMContentLoaded', async function () {
    let provider;
    let signer;
    let contract;
  
    const contractAddress = '0xdbd0275c56e924e69d6886bf224e91f9a3905b10'; // Dirección del contrato
    const contractABI = [
      {
        inputs: [
          {
            internalType: 'string',
            name: 'nuevoTexto',
            type: 'string',
          },
        ],
        name: 'almacenarTexto',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [],
        stateMutability: 'nonpayable',
        type: 'constructor',
      },
      {
        inputs: [],
        name: 'consultarTexto',
        outputs: [
          {
            internalType: 'string',
            name: '',
            type: 'string',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'propietario',
        outputs: [
          {
            internalType: 'address',
            name: '',
            type: 'address',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
    ];
  
    async function connectWallet() {
      if (typeof window.ethereum !== 'undefined') {
        try {
          provider = new ethers.providers.Web3Provider(window.ethereum);
          await provider.send('eth_requestAccounts', []);
          signer = provider.getSigner();
          const address = await signer.getAddress();
          document.getElementById(
            'accountAddress'
          ).textContent = `Conectado: ${address}`;
  
          contract = new ethers.Contract(contractAddress, contractABI, signer);
          console.log('Contrato inicializado correctamente');
        } catch (error) {
          console.error('Error al conectar MetaMask:', error);
          alert('Error al conectar MetaMask');
        }
      } else {
        alert('MetaMask no está instalado!');
      }
    }
  
    document
      .getElementById('connectButton')
      .addEventListener('click', async () => {
        await connectWallet();
      });
  
    document
      .getElementById('getTextButton')
      .addEventListener('click', async () => {
        if (contract) {
          try {
            const storedText = await contract.consultarTexto();
            document.getElementById(
              'getTextResult'
            ).textContent = `Texto almacenado: ${storedText}`;
          } catch (error) {
            console.error('Error al consultar el texto:', error);
            document.getElementById(
              'getTextResult'
            ).textContent = `Error: ${error.message}`;
          }
        }
      });
  
    document
      .getElementById('storeTextButton')
      .addEventListener('click', async () => {
        const newText = document.getElementById('storeTextInput').value.trim();
        if (newText && contract) {
          try {
            const tx = await contract.almacenarTexto(newText);
            await tx.wait();
            document.getElementById('storeTextResult').textContent =
              'Texto almacenado exitosamente.';
  
            // Limpiar campo de entrada después de almacenar el texto
            document.getElementById('storeTextInput').value = '';
          } catch (error) {
            console.error('Error al almacenar el texto:', error);
            document.getElementById(
              'storeTextResult'
            ).textContent = `Error: ${error.message}`;
          }
        } else {
          document.getElementById('storeTextResult').textContent =
            'Por favor, introduce un texto válido.';
        }
      });
  
    document
      .getElementById('getOwnerButton')
      .addEventListener('click', async () => {
        if (contract) {
          try {
            const ownerAddress = await contract.propietario();
            document.getElementById(
              'getOwnerResult'
            ).textContent = `Propietario: ${ownerAddress}`;
          } catch (error) {
            console.error('Error al consultar el propietario:', error);
            document.getElementById(
              'getOwnerResult'
            ).textContent = `Error: ${error.message}`;
          }
        }
      });
  });
  