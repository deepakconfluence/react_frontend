export interface OrganizationUnit {
  id: string;
  parentId: string | null;
  code: string;
  displayName: string;
}
