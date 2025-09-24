function TableRow({id, name, onDelete}) {
    return <tr>
        <td>{id}</td>
        <td className="left-align"><b>{name && name.substring(0,1)}</b> - {name}</td>
        <td><button onClick={onDelete}>Delete</button></td>
    </tr>
}

export default TableRow;