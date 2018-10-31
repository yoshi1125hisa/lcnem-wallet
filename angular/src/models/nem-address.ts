import { NamespaceHttp } from "nem-library";
import { nodes } from "./nodes";
import { ContactsService } from "../app/services/contacts.service";

export class NemAddress {
  public static async suggest(input: string, contact: ContactsService) {
    let suggests: string[] = [];
    let replaced = "";
    let resolved = "";
    let contacts: string[] = [];

    let replace = async () => {
      if(input.replace(/-/g, "").trim().toUpperCase().match(/^N[A-Z2-7]{39}$/)) {
        replaced = input.replace(/-/g, "");
      }
    }
    let resolve = async () => {
      try {
        let namespaceHttp = new NamespaceHttp(nodes);
        let result = await namespaceHttp.getNamespace(input).toPromise();
        resolved = result.owner.plain();
      } catch {
  
      }
    }
    let searchContacts = async () => {
      try {
        for(let id in contact.contacts!) {
          if(contact.contacts![id].name.startsWith(input)) {
            contacts = contacts.concat(contact.contacts![id].nem);
          }
        }
      } catch {
      }
    }

    await Promise.all([
      replace(),
      resolve(),
      searchContacts()
    ]);
    if(replaced) {
      suggests.push(replaced);
    }
    if(resolved) {
      suggests.push(resolved);
    }
    suggests = suggests.concat(contacts);

    return suggests;
  }
}