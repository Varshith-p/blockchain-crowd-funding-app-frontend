import { ethers } from "./ethers-5.6.esm.min.js";
import { abi, contractAddress } from "./constants.js";

const connectButton = document.getElementById("connectButton");
const fundButton = document.getElementById("fundButton");
const withdrawButton = document.getElementById("withdrawButton");
const balanceButton = document.getElementById("balanceButton");

const connect = async () => {
  if (window.ethereum !== "undefined") {
    try {
      await ethereum.request({ method: "eth_requestAccounts" });
    } catch (error) {
      console.log(error);
    }
    connectButton.textContent = "Connected";
    const accounts = await ethereum.request({ method: "eth_accounts" });
    console.log(accounts);
  } else {
    alert("Please install Metamask");
  }
};

const fund = async () => {
  const ethAmount = document.getElementById("ethAmount").value;
  console.log(`funding with ${ethAmount} ETH...`);
  if (window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
      const transactionResponse = await contract.fund({
        value: ethers.utils.parseEther(ethAmount),
      });
      document.getElementById("transaction-id").textContent =
        transactionResponse.hash;
      document.getElementById("transaction-status").textContent = "Pending";
      await listenForTransactionMine(transactionResponse, provider);
      console.log("Funding done!");
      document.getElementById("transaction-status").textContent = "Success";
    } catch (error) {
      console.log(error);
    }
  }
};

function listenForTransactionMine(transactionResponse, provider) {
  console.log(`Mining ${transactionResponse.hash}...`);
  return new Promise((resolve, reject) => {
    provider.once(transactionResponse.hash, (transactionReceipt) => {
      console.log(transactionReceipt);
      console.log(
        `Compelted with ${transactionReceipt.confirmations} confirmations`
      );
      resolve();
    });
  });
}

connectButton.onclick = connect;
fundButton.onclick = fund;
