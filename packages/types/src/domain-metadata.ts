export interface DomainMetadataRequest {
  method: 'avalanche_sendDomainMetadata';
  params: DomainMetadata;
}

export interface DomainMetadata {
  domain: string;
  name?: string;
  icon?: string;
  tabId?: number;
  url?: string;
}
