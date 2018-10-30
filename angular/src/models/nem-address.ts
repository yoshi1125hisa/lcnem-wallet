import { NamespaceHttp } from "nem-library";
import { nodes } from "./nodes";
import { ContactsService } from "../app/services/contacts.service";

export class NemAddress {
  public static format(ref: {input: string}) {
    if(ref.input.replace(/-/g, "").trim().toUpperCase().match(/^N[A-Z2-7]{39}$/)) {
      ref.input = ref.input.replace(/-/g, "");
    }
  }
  
  public static async suggest(input: string, contact: ContactsService) {
    let suggests: string[] = [];
    await Promise.all([
      async () => {
        try {
          let namespaceHttp = new NamespaceHttp(nodes);
          let result = await namespaceHttp.getNamespace(input).toPromise();
          let resolved = result.owner.plain();
          suggests.push(resolved);
        } catch {
    
        }
      },
      async () => {
        try {
          for(let id in contact.contacts!) {
            if(contact.contacts![id].name == input) {
              suggests = suggests.concat(contact.contacts![id].nem);
            }
          }
        } catch {

        }
      }
    ]);

    return suggests;
  }
}