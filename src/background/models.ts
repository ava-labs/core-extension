export interface DomainMetadata {
  method: 'metamask_sendDomainMetadata';
  params: { name: string; icon: string };
}

export interface EthCall {
  from?: string;
  to: string;
  gas?: string;
  gasPrice?: string;
  value?: string;
  data?: string;
  id: string | number | void;
}
