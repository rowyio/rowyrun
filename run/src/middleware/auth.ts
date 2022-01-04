import { auth } from "../firebaseConfig";
import jwt_decode from "jwt-decode";
import axios from "axios";
import { getProjectId } from "../metadataService";
const authorizedServiceAccountDomain = "@rowy-service.iam.gserviceaccount.com";

export const requireAuth = async (req: any, res: any, next: any) => {
  try {
    const authHeader = req.get("Authorization");
    if (!authHeader) return res.status(401).send("Unauthorized");
    const authToken = authHeader.split(" ")[1];
    const decodedToken = await auth.verifyIdToken(authToken);
    res.locals.user = decodedToken;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).send({ error });
  }
};

export const hasAnyRole =
  (roles: string[]) => async (req: any, res: any, next: Function) => {
    try {
      const user = res.locals.user;
      const userRoles: string[] = user.roles;
      // user roles must have at least one of the roles
      const authorized = roles.some((role) => userRoles.includes(role));
      if (authorized) {
        next();
      } else {
        const latestUser = await auth.getUser(user.uid);
        const authDoubleCheck = roles.some((role) =>
          latestUser.customClaims.roles.includes(role)
        );
        if (authDoubleCheck) {
          next();
        } else {
          res.status(401).send({
            error: "Unauthorized",
            message: "User does not have any of the required roles",
            roles,
          });
        }
      }
    } catch (err) {
      res.status(401).send({ error: err });
    }
  };

type JWTPayload = {
  email: string;
  aud: string;
  email_verified: boolean;
  exp: number;
  iat: number;
  iss: string;
  sub: string;
};
export const verifyRowyServiceRequest = async (
  req: any,
  res: any,
  next: Function
) => {
  // decode jwt token from header
  const authHeader = req.get("Authorization");
  if (!authHeader) return res.status(401).send("Unauthorized");
  const token = authHeader.split(" ")[1];
  const decodedJWT: JWTPayload = jwt_decode(token);

  // decode header by passing in options (useful for when you need `kid` to verify a JWT):
  const decodedHeader = jwt_decode(token, { header: true });

  // verify valid service account email
  if (!decodedJWT.email.endsWith(authorizedServiceAccountDomain)) {
    return res.status(401).send("Unauthorized: invalid service account email");
  }
  // get kid from google cert: https://www.googleapis.com/oauth2/v3/certs
  const request_kid = decodedHeader["kid"];
  const cert = await axios.get(`https://www.googleapis.com/oauth2/v3/certs`);
  const certBody = cert.data;
  const cert_kid_keys = certBody.keys.map((key) => key.kid);

  if (!cert_kid_keys.includes(request_kid)) {
    return res.status(401).send("Unauthorized: invalid kid");
  }
  // verify alg is RS256
  if (decodedHeader["alg"] !== "RS256") {
    return res.status(401).send("Unauthorized: invalid alg");
  }

  const projectId = await getProjectId();
  // verify audience
  const valid_aud = decodedJWT.aud === projectId;
  if (!valid_aud) {
    return res.status(401).send("Unauthorized: invalid audience");
  }
  next();
};
