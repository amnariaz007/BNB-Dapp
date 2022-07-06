import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalFooter,
  ModalBody,
} from '@chakra-ui/react';

export default function Info(props) {
  return (
    <Modal onClose={props.onClose} isOpen={props.isOpen} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Caramel finance</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <p>Hi, here a super simple web3 joke to earn:</p>
          <br />
          <p>
            - <b>Stake</b> the amount you want. Wait a bit (depending on how
            many interact with, it could be a few minutes).
          </p>
          <br />
          <p>
            - <b>Redeem</b> your equity included <b>20% earnings</b>.
          </p>
          <br />
          <p>
            In this platform you will always see the calculation of your
            earnings and the progress.
          </p>
          <br />
          <p>Joke based on ponzi scheme. It's new and it works.</p>
          <br />
          <p>You can see the contract code on BSC at the link below.</p>
          <br />
          <p> Enjoy ✌️</p>
        </ModalBody>
        <ModalFooter>
          <p>
            <i>coinio–05.06.22</i>
          </p>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
