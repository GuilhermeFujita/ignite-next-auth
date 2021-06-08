import { useContext } from "react"
import { AuthContext } from "../contexts/AuthContext"
import { ValidateUserPermissions } from "../utils/ValidateUserPermissions";

type UseCamParams = {
  permissions?: string[];
  roles?: string[];
}

export function useCan({ permissions, roles }: UseCamParams) {
  const { user, IsAuthenticated } = useContext(AuthContext);

  if (!IsAuthenticated) return false;

  const userHasValidPermissions = ValidateUserPermissions({
    user, permissions, roles
  })

  return userHasValidPermissions;
}