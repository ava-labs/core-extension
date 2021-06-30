export interface DomainMetadata {
  method: 'metamask_sendDomainMetadata';
  params: { name: string; icon: string };
}
